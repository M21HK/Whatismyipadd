<script setup lang="ts">
import { useHead } from '@vueuse/head';
import { useMediaQuery } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import AdPanel from '../components/hud/AdPanel.vue';
import ReactorCore from '../components/hud/ReactorCore.vue';
import ToolNodeCluster from '../components/hud/ToolNodeCluster.vue';
import { useToolStore } from '@/tools/tools.store';
import { useStyleStore } from '@/stores/style.store';

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
</script>

<template>
  <div class="hud-stage-vignette" aria-hidden="true" />

  <div class="hud-page">
    <AdPanel variant="horizontal" class="hud-ad-top" />

    <div class="hud-body">
      <div v-if="isWideEnoughForRadial" class="hud-stage">
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
        />
      </div>

      <div v-else class="hud-stacked">
        <div class="hud-stacked-reactor">
          <ReactorCore />
        </div>

        <div v-for="cluster in clusters" :key="cluster.name" class="hud-stacked-cluster">
          <div class="cluster-header">
            <span class="bracket">[</span>{{ cluster.name }}<span class="bracket">]</span>
          </div>
          <div class="hud-stacked-nodes">
            <router-link
              v-for="tool in cluster.components"
              :key="tool.path"
              :to="tool.path"
              class="hud-stacked-node"
            >
              <n-icon size="16" :component="tool.icon" />
              {{ tool.name }}
            </router-link>
          </div>
        </div>
      </div>

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
  background: rgba(4, 9, 17, 0.6);
  border: 1px solid rgba(34, 211, 238, 0.25);
  clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
  color: #cfe9f1;
  text-decoration: none;
  font-family: var(--jarvis-font-mono);
  font-size: 11px;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  transition: border-color 0.2s ease, background 0.2s ease;

  &:hover {
    border-color: var(--jarvis-cyan);
    background: rgba(34, 211, 238, 0.1);
  }
}
</style>
