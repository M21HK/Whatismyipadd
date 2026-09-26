<script setup lang="ts">
import { useHead } from '@vueuse/head';
import { useMediaQuery } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { computed, defineAsyncComponent, onBeforeUnmount, onMounted, ref } from 'vue';
import AdPanel from '../components/hud/AdPanel.vue';
import ReactorCore from '../components/hud/ReactorCore.vue';
import ToolNodeCluster from '../components/hud/ToolNodeCluster.vue';
import ToolWorkspace from '../components/hud/ToolWorkspace.vue';
import { useToolStore } from '@/tools/tools.store';
import { useStyleStore } from '@/stores/style.store';
import type { Tool } from '@/tools/tools.types';

useHead({ title: 'IT Tools - Handy online tools for developers' });
const { t } = useI18n();

const toolStore = useToolStore();
const styleStore = useStyleStore();
const { favoriteTools, toolsByCategory } = storeToRefs(toolStore);

// Full-bleed cinematic view: auto-collapse the sidebar when landing on the
// topology map. The header toggle still brings it back at any time, and
// tool detail pages are unaffected since they mount their own layout state.
const wasMenuCollapsedOnMount = styleStore.isMenuCollapsed;
onMounted(() => {
  styleStore.isMenuCollapsed = true;
});
onBeforeUnmount(() => {
  styleStore.isMenuCollapsed = wasMenuCollapsedOnMount;
});

const clusters = computed(() => [
  ...(favoriteTools.value.length > 0
    ? [{ name: t('home.categories.favoriteTools'), components: favoriteTools.value }]
    : []),
  ...toolsByCategory.value,
]);

const clusterPositions = computed(() => {
  const total = clusters.value.length;

  return clusters.value.map((cluster, index) => {
    // Alternate near/far radii so adjacent clusters (which sit close
    // together angularly) don't collide, and push larger categories
    // further out since they render wider node groups.
    const baseRadius = index % 2 === 0 ? 38 : 46;
    const radius = cluster.components.length > 8 ? baseRadius + 4 : baseRadius;
    const angle = (index * (360 / total) - 90) * (Math.PI / 180);
    return {
      ...cluster,
      x: 50 + radius * Math.cos(angle),
      y: 50 + radius * Math.sin(angle),
    };
  });
});

const hoveredIndex = ref<number | null>(null);

// Below this width the radial layout math no longer degrades gracefully
// (labels collide, connector lines cross the reactor core), so fall back to
// a simple stacked list of cluster panels instead.
const isWideEnoughForRadial = useMediaQuery('(min-width: 1100px)');

// Selecting a tool node opens the "Command Console" workspace in place of
// a modal/new page: the topology map (radial or stacked) docks into a
// shrunken control rail on wide screens, or hides entirely on narrow
// screens where there's no room for a side-by-side rail.
const activeTool = ref<Tool | null>(null);

function selectTool(tool: Tool) {
  activeTool.value = tool;
}
function closeWorkspace() {
  activeTool.value = null;
}

const activeToolComponent = computed(() => (activeTool.value ? defineAsyncComponent(activeTool.value.component) : null));

const activeCategoryName = computed(() => {
  if (!activeTool.value) {
    return null;
  }
  const found = clusters.value.find(cluster => cluster.components.some(tool => tool.path === activeTool.value?.path));
  return found?.name ?? null;
});
</script>

<template>
  <div class="hud-stage-vignette" aria-hidden="true" />

  <div class="hud-page">
    <AdPanel variant="horizontal" class="hud-ad-top" />

    <div class="hud-body">
      <div v-if="!activeTool || isWideEnoughForRadial" class="hud-stage-wrapper" :class="{ docked: activeTool }">
        <Transition name="hud-rail-fade" mode="out-in">
          <div v-if="activeTool" key="rail" class="hud-rail">
            <div class="hud-rail-reactor">
              <ReactorCore compact />
            </div>
            <div class="hud-rail-categories">
              <button
                v-for="cluster in clusters"
                :key="cluster.name"
                type="button"
                class="hud-rail-chip"
                :class="{ active: cluster.name === activeCategoryName }"
                @click="closeWorkspace"
              >
                <span class="hud-rail-chip-dot" aria-hidden="true" />
                <span class="hud-rail-chip-label">{{ cluster.name }}</span>
              </button>
            </div>
          </div>

          <div v-else-if="isWideEnoughForRadial" key="radial" class="hud-stage">
            <svg class="hud-connectors" viewBox="0 0 100 100" preserveAspectRatio="none">
              <line
                v-for="(cluster, index) in clusterPositions"
                :key="`line-${cluster.name}`"
                class="hud-connector"
                :class="{ pulsing: hoveredIndex === index }"
                x1="50"
                y1="50"
                :x2="cluster.x"
                :y2="cluster.y"
              />
            </svg>

            <div class="hud-reactor">
              <ReactorCore />
            </div>

            <ToolNodeCluster
              v-for="(cluster, index) in clusterPositions"
              :key="cluster.name"
              :name="cluster.name"
              :tools="cluster.components"
              :x="cluster.x"
              :y="cluster.y"
              :pulsing="hoveredIndex === index"
              @hover-start="hoveredIndex = index"
              @hover-end="hoveredIndex = null"
              @select="selectTool"
            />
          </div>

          <div v-else key="stacked" class="hud-stacked">
            <div class="hud-stacked-reactor">
              <ReactorCore />
            </div>

            <div v-for="cluster in clusters" :key="cluster.name" class="hud-stacked-cluster">
              <div class="cluster-header">
                <span class="bracket">[</span>{{ cluster.name }}<span class="bracket">]</span>
              </div>
              <div class="hud-stacked-nodes">
                <button
                  v-for="tool in cluster.components"
                  :key="tool.path"
                  type="button"
                  class="hud-stacked-node"
                  @click="selectTool(tool)"
                >
                  <n-icon size="16" :component="tool.icon" />
                  {{ tool.name }}
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <Transition name="hud-console-fade">
        <ToolWorkspace
          v-if="activeTool"
          :tool="activeTool"
          :component="activeToolComponent"
          class="hud-workspace"
          @close="closeWorkspace"
        />
      </Transition>

      <AdPanel variant="vertical" class="hud-ad-side" />
    </div>
  </div>
</template>

<style scoped lang="less">
.hud-page {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-height: calc(100vh - 60px);
  padding-top: 10px;
}

.hud-ad-top {
  align-self: center;
}

.hud-body {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 20px;
  flex: 1;
}

.hud-stage-wrapper {
  flex: 1;
  min-width: 0;
  transition: flex-grow 0.5s cubic-bezier(0.16, 1, 0.3, 1), flex-basis 0.5s cubic-bezier(0.16, 1, 0.3, 1);

  &.docked {
    flex: 0 0 148px;
  }
}

.hud-stage {
  position: relative;
  flex: 1;
  min-height: 920px;
  aspect-ratio: 16 / 11;
}

.hud-connectors {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.hud-reactor {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}

.hud-workspace {
  flex: 1;
  min-width: 0;
}

.hud-ad-side {
  position: sticky;
  top: 20px;
  flex-shrink: 0;
}

.hud-stacked {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
  flex: 1;
  padding: 10px 4px 40px;
}

.hud-stacked-reactor {
  margin-bottom: 8px;
}

.hud-stacked-cluster {
  width: 100%;
  max-width: 520px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.cluster-header {
  font-family: var(--jarvis-font-mono);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--jarvis-cyan);
  text-shadow: 0 0 6px rgba(34, 211, 238, 0.35);

  .bracket {
    color: var(--jarvis-amber);
  }
}

.hud-stacked-nodes {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px;
}

.hud-stacked-node {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  appearance: none;
  background: rgba(4, 9, 17, 0.6);
  border: 1px solid rgba(34, 211, 238, 0.25);
  clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
  color: #cfe9f1;
  text-decoration: none;
  font-family: var(--jarvis-font-mono);
  font-size: 11px;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  cursor: pointer;
  transition: border-color 0.2s ease, background 0.2s ease;

  &:hover {
    border-color: var(--jarvis-cyan);
    background: rgba(34, 211, 238, 0.1);
  }
}

// Docked control rail shown once a tool workspace is open on wide screens.
.hud-rail {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  width: 100%;
  padding-top: 8px;
}

.hud-rail-categories {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.hud-rail-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  appearance: none;
  background: rgba(4, 9, 17, 0.6);
  border: 1px solid rgba(34, 211, 238, 0.16);
  color: rgba(124, 147, 168, 0.85);
  font-family: var(--jarvis-font-mono);
  font-size: 9px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  text-align: left;
  cursor: pointer;
  transition: border-color 0.2s ease, color 0.2s ease, background 0.2s ease;

  &:hover {
    border-color: var(--jarvis-cyan);
    color: #cfe9f1;
  }

  &.active {
    border-color: var(--jarvis-cyan);
    background: rgba(34, 211, 238, 0.1);
    color: var(--jarvis-cyan);
  }
}

.hud-rail-chip-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  flex-shrink: 0;
  background: rgba(124, 147, 168, 0.5);
}

.hud-rail-chip.active .hud-rail-chip-dot {
  background: var(--jarvis-cyan);
  box-shadow: 0 0 6px rgba(34, 211, 238, 0.9);
}

.hud-rail-chip-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hud-rail-fade-enter-active,
.hud-rail-fade-leave-active {
  transition: opacity 0.25s ease;
}

.hud-rail-fade-enter-from,
.hud-rail-fade-leave-to {
  opacity: 0;
}

.hud-console-fade-enter-active {
  transition: opacity 0.4s ease 0.15s, transform 0.4s ease 0.15s;
}

.hud-console-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.hud-console-fade-enter-from,
.hud-console-fade-leave-to {
  opacity: 0;
  transform: translateX(24px);
}
</style>
