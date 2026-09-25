<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

const barCount = 24;
const bars = ref<number[]>(Array.from({ length: barCount }, () => 12 + Math.random() * 70));

let intervalId: ReturnType<typeof setInterval> | undefined;

onMounted(() => {
  intervalId = setInterval(() => {
    bars.value = bars.value.map(previous => {
      const drift = (Math.random() - 0.5) * 60;
      const next = previous + drift;
      return Math.min(96, Math.max(8, next));
    });
  }, 420);
});

onBeforeUnmount(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});
</script>

<template>
  <div class="diagnostics-widget">
    <div class="diagnostics-header">
      <span class="bracket">[</span>
      <span class="label">NETWORK NODE DIAGNOSTICS</span>
      <span class="bracket">]</span>
    </div>

    <div class="equalizer" role="img" aria-label="Network node diagnostics live signal">
      <span
        v-for="(height, index) in bars"
        :key="index"
        class="bar"
        :class="{ amber: index % 5 === 0 }"
        :style="{ height: `${height}%` }"
      />
    </div>

    <div class="diagnostics-readout">
      <span class="dot" />
      <span>LINK STABLE</span>
    </div>
  </div>
</template>

<style scoped lang="less">
.diagnostics-widget {
  margin: 8px 12px 4px;
  padding: 10px 12px 8px;
  border: 1px solid rgba(34, 211, 238, 0.18);
  background: rgba(4, 9, 17, 0.5);
  border-radius: 2px;
  font-family: var(--jarvis-font-mono);
}

.diagnostics-header {
  font-size: 10px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: rgba(124, 147, 168, 0.85);
  margin-bottom: 8px;

  .bracket {
    color: rgba(124, 147, 168, 0.4);
  }

  .label {
    color: var(--jarvis-cyan);
    opacity: 0.75;
  }
}

.equalizer {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 36px;
  padding-bottom: 2px;
}

.bar {
  flex: 1;
  min-width: 2px;
  border-radius: 1px;
  background: var(--jarvis-cyan);
  box-shadow: 0 0 4px rgba(34, 211, 238, 0.6);
  opacity: 0.75;
  transition: height 0.4s ease-out;

  &.amber {
    background: var(--jarvis-amber);
    box-shadow: 0 0 4px rgba(245, 158, 11, 0.6);
  }
}

.diagnostics-readout {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  font-size: 10px;
  letter-spacing: 0.5px;
  color: rgba(124, 147, 168, 0.7);

  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--jarvis-cyan);
    box-shadow: 0 0 6px var(--jarvis-cyan);
    animation: jarvis-pulse-dot 1.8s ease-in-out infinite;
  }
}
</style>
