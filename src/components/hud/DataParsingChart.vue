<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

// Live "Data Parsing" readout for the tool workspace console: a moving
// line chart that idles with a gentle drift and bursts into rapid, jittery
// motion whenever `pulse` changes (bumped on every keystroke inside the
// console), simulating heavy cryptographic/parsing throughput.
const props = defineProps<{ pulse: number }>();

const POINT_COUNT = 34;
const points = ref<number[]>(Array.from({ length: POINT_COUNT }, () => 16 + (Math.random() - 0.5) * 4));
const pathPoints = ref('');
const active = ref(false);
const hexReadout = ref<string[]>(Array.from({ length: 6 }, randomHex));

function randomHex() {
  return Math.floor(Math.random() * 65536).toString(16).toUpperCase().padStart(4, '0');
}

function render() {
  pathPoints.value = points.value
    .map((y, index) => `${((index / (POINT_COUNT - 1)) * 120).toFixed(1)},${y.toFixed(1)}`)
    .join(' ');
}
render();

function tick() {
  const amplitude = active.value ? 13 : 3;
  points.value = [...points.value.slice(1), 16 + (Math.random() - 0.5) * amplitude];
  render();

  if (active.value) {
    hexReadout.value = hexReadout.value.map(randomHex);
  }
}

let intervalId: ReturnType<typeof setInterval> | undefined;
let activeTimeout: ReturnType<typeof setTimeout> | undefined;

onMounted(() => {
  intervalId = setInterval(tick, 90);
});

watch(() => props.pulse, () => {
  active.value = true;
  if (activeTimeout) {
    clearTimeout(activeTimeout);
  }
  activeTimeout = setTimeout(() => {
    active.value = false;
  }, 1100);
});

onBeforeUnmount(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
  if (activeTimeout) {
    clearTimeout(activeTimeout);
  }
});
</script>

<template>
  <div class="data-parsing-chart" :class="{ active }">
    <div class="dpc-label">
      <span class="bracket">[</span>DATA PARSING<span class="bracket">]</span>
      <span class="dpc-status">{{ active ? 'PROCESSING' : 'IDLE' }}</span>
    </div>

    <svg class="dpc-svg" viewBox="0 0 120 32" preserveAspectRatio="none">
      <polyline :points="pathPoints" fill="none" stroke="var(--jarvis-cyan)" stroke-width="1.4" class="dpc-line" />
    </svg>

    <div class="dpc-hexdump" aria-hidden="true">
      <span v-for="(chunk, index) in hexReadout" :key="index">0x{{ chunk }}</span>
    </div>
  </div>
</template>

<style scoped lang="less">
.data-parsing-chart {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background: rgba(4, 9, 17, 0.55);
  border: 1px solid rgba(34, 211, 238, 0.18);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &.active {
    border-color: rgba(34, 211, 238, 0.45);
    box-shadow: 0 0 16px rgba(34, 211, 238, 0.2);
  }
}

.dpc-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: var(--jarvis-font-mono);
  font-size: 9px;
  letter-spacing: 1px;
  color: rgba(124, 147, 168, 0.85);

  .bracket {
    color: rgba(124, 147, 168, 0.4);
  }
}

.dpc-status {
  color: var(--jarvis-amber);
  transition: color 0.3s ease;
}

.data-parsing-chart.active .dpc-status {
  color: var(--jarvis-cyan);
  text-shadow: 0 0 6px rgba(34, 211, 238, 0.6);
}

.dpc-svg {
  width: 100%;
  height: 48px;
  display: block;
}

.dpc-line {
  filter: drop-shadow(0 0 3px rgba(34, 211, 238, 0.7));
}

.dpc-hexdump {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-family: var(--jarvis-font-mono);
  font-size: 9px;
  letter-spacing: 0.5px;
  color: rgba(245, 158, 11, 0.55);
}
</style>
