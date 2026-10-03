<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

// Compact mode renders a shrunken version of the core for the docked
// control rail shown once a tool workspace is open - same live telemetry,
// smaller footprint, network traffic readout dropped to save vertical space.
defineProps<{ compact?: boolean }>();

// Mock "System Load" sine wave: a handful of points redrawn on an interval
// with a slowly advancing phase plus small random jitter, so the trace
// looks alive without pulling in a charting library (this app is Vue, not
// React, so Recharts is not an option here).
const SINE_POINT_COUNT = 13;
const phase = ref(0);
const sineJitter = ref<number[]>(Array.from({ length: SINE_POINT_COUNT }, () => 0));

const sinePoints = ref('');

function computeSinePoints() {
  sinePoints.value = Array.from({ length: SINE_POINT_COUNT }, (_, index) => {
    const x = (index / (SINE_POINT_COUNT - 1)) * 120;
    const y = 16 + Math.sin(phase.value + index * 0.55) * 9 + sineJitter.value[index];
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
}

// Mock "Network Traffic" bar chart, randomized heights drifting each tick.
const BAR_COUNT = 12;
const barHeights = ref<number[]>(Array.from({ length: BAR_COUNT }, () => 6 + Math.random() * 22));

computeSinePoints();

let intervalId: ReturnType<typeof setInterval> | undefined;

onMounted(() => {
  intervalId = setInterval(() => {
    phase.value += 0.35;
    sineJitter.value = sineJitter.value.map(() => (Math.random() - 0.5) * 3);
    computeSinePoints();

    barHeights.value = barHeights.value.map((height) => {
      const drift = (Math.random() - 0.5) * 14;
      return Math.min(30, Math.max(4, height + drift));
    });
  }, 950);
});

onBeforeUnmount(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});
</script>

<template>
  <div class="reactor-core" :class="{ compact }">
    <div class="reactor-radar" aria-hidden="true">
      <svg viewBox="0 0 200 200" width="100%" height="100%">
        <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" stroke-width="1" opacity="0.5" />
        <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" stroke-width="1" opacity="0.4" />
        <circle cx="100" cy="100" r="44" fill="none" stroke="currentColor" stroke-width="1" opacity="0.3" />
        <line x1="100" y1="4" x2="100" y2="196" stroke="currentColor" stroke-width="1" opacity="0.25" />
        <line x1="4" y1="100" x2="196" y2="100" stroke="currentColor" stroke-width="1" opacity="0.25" />
        <g class="reactor-sweep-group">
          <path d="M 100 100 L 100 4 A 96 96 0 0 1 168.6 31.4 Z" fill="currentColor" opacity="0.55" />
        </g>
        <circle cx="100" cy="100" r="6" fill="currentColor" class="reactor-core-dot" />
      </svg>
    </div>

    <div class="reactor-readouts">
      <div class="readout">
        <div class="readout-label">
          <span class="bracket">[</span>SYSTEM LOAD<span class="bracket">]</span>
        </div>
        <svg class="readout-chart" viewBox="0 0 120 32" preserveAspectRatio="none">
          <polyline
            :points="sinePoints"
            fill="none"
            stroke="var(--jarvis-cyan)"
            stroke-width="1.5"
            class="readout-line"
          />
        </svg>
      </div>

      <div v-if="!compact" class="readout">
        <div class="readout-label">
          <span class="bracket">[</span>NETWORK TRAFFIC<span class="bracket">]</span>
        </div>
        <svg class="readout-chart" viewBox="0 0 120 32" preserveAspectRatio="none">
          <rect
            v-for="(height, index) in barHeights"
            :key="index"
            :x="index * 10"
            :y="32 - height"
            width="7"
            :height="height"
            :fill="index % 3 === 0 ? 'var(--jarvis-amber)' : 'var(--jarvis-cyan)'"
            opacity="0.85"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.reactor-core {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  pointer-events: none;
  transition: gap 0.4s ease;

  &.compact {
    gap: 8px;

    .reactor-radar {
      width: 64px;
      height: 64px;
      filter: drop-shadow(0 0 10px rgba(34, 211, 238, 0.45));
    }

    .readout {
      width: 100%;
    }

    .readout-label {
      font-size: 7px;
    }
  }
}

.reactor-radar {
  width: 190px;
  height: 190px;
  color: var(--jarvis-cyan);
  filter: drop-shadow(0 0 18px rgba(34, 211, 238, 0.45));
  transition: width 0.4s ease, height 0.4s ease;
}

.reactor-sweep-group {
  transform-origin: 100px 100px;
  animation: reactor-spin 8s linear infinite;
}

@keyframes reactor-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.reactor-core-dot {
  filter: drop-shadow(0 0 6px rgba(34, 211, 238, 0.9));
}

.reactor-readouts {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
}

.readout {
  width: 140px;
  padding: 8px 10px;
  border: 1px solid rgba(34, 211, 238, 0.16);
  background: rgba(4, 9, 17, 0.45);
}

.readout-label {
  font-family: var(--jarvis-font-mono);
  font-size: 9px;
  letter-spacing: 1px;
  color: rgba(124, 147, 168, 0.85);
  margin-bottom: 6px;

  .bracket {
    color: rgba(124, 147, 168, 0.4);
  }
}

.readout-chart {
  width: 100%;
  height: 32px;
  display: block;
}

.readout-line {
  filter: drop-shadow(0 0 3px rgba(34, 211, 238, 0.7));
}
</style>
