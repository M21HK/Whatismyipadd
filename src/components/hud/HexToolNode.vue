<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';
import type { Tool } from '@/tools/tools.types';

defineProps<{ tool: Tool }>();
const emit = defineEmits<{
  (e: 'hover-start'): void
  (e: 'hover-end'): void
  (e: 'select', tool: Tool): void
}>();

// Same "data decryption" hex-flash effect used on ToolCard, scaled down for
// the compact node label.
const HEX_CHARS = '0123456789ABCDEF';
const scrambleText = ref('');
let scrambleTimer: ReturnType<typeof setInterval> | null = null;

function randomHex(length = 5) {
  return Array.from({ length }, () => HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)]).join('');
}

function startScramble() {
  stopScramble();
  let ticks = 0;
  scrambleTimer = setInterval(() => {
    scrambleText.value = randomHex();
    ticks += 1;
    if (ticks > 4) {
      stopScramble();
    }
  }, 90);
}

function stopScramble() {
  if (scrambleTimer) {
    clearInterval(scrambleTimer);
    scrambleTimer = null;
  }
  scrambleText.value = '';
}

onBeforeUnmount(stopScramble);

function onEnter() {
  startScramble();
  emit('hover-start');
}

function onLeave() {
  stopScramble();
  emit('hover-end');
}
</script>

<template>
  <button
    type="button"
    class="hex-node"
    @click="emit('select', tool)"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
  >
    <n-icon class="hex-node-icon" size="16" :component="tool.icon" />
    <span class="hex-node-label">{{ tool.name }}</span>
    <span class="hex-node-scramble" aria-hidden="true">{{ scrambleText }}</span>
  </button>
</template>

<style scoped lang="less">
.hex-node {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px 6px 8px;
  appearance: none;
  background: rgba(4, 9, 17, 0.6);
  border: 1px solid rgba(34, 211, 238, 0.25);
  clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
  color: #cfe9f1;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  font: inherit;
  text-align: left;
  transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    border-color: var(--jarvis-cyan);
    background: rgba(34, 211, 238, 0.1);
    transform: translateY(-1px);
    box-shadow: 0 0 12px rgba(34, 211, 238, 0.4);
  }
}

.hex-node-icon {
  color: var(--jarvis-cyan);
  flex-shrink: 0;
}

.hex-node-label {
  font-family: var(--jarvis-font-mono);
  font-size: 11px;
  letter-spacing: 0.3px;
  text-transform: uppercase;
}

.hex-node-scramble {
  font-family: var(--jarvis-font-mono);
  font-size: 9px;
  letter-spacing: 0.5px;
  color: var(--jarvis-amber);
  text-shadow: 0 0 6px rgba(245, 158, 11, 0.6);
}
</style>
