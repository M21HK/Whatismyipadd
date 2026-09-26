<script setup lang="ts">
import { computed, ref } from 'vue';
import HexToolNode from './HexToolNode.vue';
import type { Tool } from '@/tools/tools.types';

const props = defineProps<{
  name: string
  tools: Tool[]
  x: number
  y: number
  pulsing?: boolean
}>();

const emit = defineEmits<{
  (e: 'hover-start'): void
  (e: 'hover-end'): void
  (e: 'select', tool: Tool): void
}>();

// Large categories (Converter, Web, ...) render dozens of nodes, which would
// collide with neighboring clusters on the radial map. Cap what's shown up
// front and let visitors expand in place - there's no dedicated category
// route to deep-link an overflow chip to.
const MAX_VISIBLE = 6;
const showAll = ref(false);

const visibleTools = computed(() => (showAll.value ? props.tools : props.tools.slice(0, MAX_VISIBLE)));
const overflowCount = computed(() => Math.max(0, props.tools.length - MAX_VISIBLE));
</script>

<template>
  <div
    class="tool-cluster"
    :class="{ pulsing }"
    :style="{ left: `${x}%`, top: `${y}%` }"
    @mouseenter="emit('hover-start')"
    @mouseleave="emit('hover-end')"
  >
    <div class="cluster-header">
      <span class="bracket">[</span>{{ name }}<span class="bracket">]</span>
    </div>
    <div class="cluster-nodes">
      <HexToolNode
        v-for="tool in visibleTools"
        :key="tool.path"
        :tool="tool"
        @hover-start="emit('hover-start')"
        @hover-end="emit('hover-end')"
        @select="emit('select', $event)"
      />
      <button
        v-if="overflowCount > 0 && !showAll"
        type="button"
        class="cluster-overflow"
        @click="showAll = true"
      >
        +{{ overflowCount }}
      </button>
    </div>
  </div>
</template>

<style scoped lang="less">
.tool-cluster {
  position: absolute;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  max-width: 260px;
  z-index: 1;
}

.cluster-header {
  font-family: var(--jarvis-font-mono);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--jarvis-cyan);
  text-shadow: 0 0 6px rgba(34, 211, 238, 0.35);
  white-space: nowrap;

  .bracket {
    color: var(--jarvis-amber);
  }
}

.tool-cluster.pulsing .cluster-header {
  text-shadow: 0 0 12px rgba(34, 211, 238, 0.75);
}

.cluster-nodes {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px;
}

.cluster-overflow {
  padding: 6px 10px;
  background: rgba(4, 9, 17, 0.6);
  border: 1px dashed rgba(245, 158, 11, 0.45);
  clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
  color: var(--jarvis-amber);
  font-family: var(--jarvis-font-mono);
  font-size: 11px;
  letter-spacing: 0.3px;
  cursor: pointer;
  transition: border-color 0.2s ease, background 0.2s ease;

  &:hover {
    border-color: var(--jarvis-amber);
    background: rgba(245, 158, 11, 0.12);
  }
}
</style>

