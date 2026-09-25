<script setup lang="ts">
const clock = ref(formatTime(new Date()));

function formatTime(date: Date) {
  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

const interval = setInterval(() => {
  clock.value = formatTime(new Date());
}, 1000);

onBeforeUnmount(() => {
  clearInterval(interval);
});
</script>

<template>
  <div class="system-status" role="status">
    <span class="status-dot" aria-hidden="true" />
    <div class="status-text">
      <span class="status-label">SYSTEM STATUS</span>
      <span class="status-value">ONLINE</span>
    </div>

    <span class="status-clock">{{ clock }}</span>
  </div>
</template>

<style scoped lang="less">
.system-status {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 14px;
  border-radius: 4px;
  border: 1px solid rgba(34, 211, 238, 0.3);
  background: rgba(34, 211, 238, 0.06);
  white-space: nowrap;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--jarvis-cyan);
  box-shadow: 0 0 6px var(--jarvis-cyan), 0 0 2px var(--jarvis-cyan);
  animation: jarvis-pulse-dot 1.8s ease-in-out infinite;
}

.status-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.status-label {
  font-size: 9px;
  letter-spacing: 1.5px;
  color: #7c93a8;
}

.status-value {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  color: var(--jarvis-cyan);
  text-shadow: 0 0 8px rgba(34, 211, 238, 0.55);
}

.status-clock {
  font-size: 11px;
  color: var(--jarvis-amber);
  border-left: 1px solid rgba(245, 158, 11, 0.3);
  padding-left: 10px;
  letter-spacing: 0.5px;
}


@media (max-width: 900px) {
  .status-telemetry {
    display: none;
  }
}

@media (max-width: 640px) {
  .status-clock {
    display: none;
  }
}
</style>
