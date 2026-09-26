<script setup lang="ts">
import { computed, onMounted } from 'vue';

const props = defineProps<{ variant: 'horizontal' | 'vertical' }>();

const dimensions = computed(() => (props.variant === 'horizontal' ? { width: 728, height: 90 } : { width: 300, height: 600 }));
const label = computed(() => (props.variant === 'horizontal' ? 'SATELLITE DATA FEED' : 'EXTERNAL TELEMETRY'));

onMounted(() => {
  try {
    (window as any).adsbygoogle = (window as any).adsbygoogle || [];
    (window as any).adsbygoogle.push({});
  } catch {
    // AdSense script not yet available (blocked, offline, or still loading) - fail silently.
  }
});
</script>

<template>
  <div class="ad-panel" :class="variant">
    <div class="ad-panel-label">
      <span class="bracket">[</span>{{ label }}<span class="bracket">]</span>
    </div>
    <!--
      data-ad-slot is a placeholder: no real AdSense ad unit has been created
      for this panel yet. Replace "0000000000" with the actual slot ID from
      the AdSense dashboard before relying on this panel to serve ads -
      leaving a fabricated ID here would silently no-op or mismatch once a
      real slot is configured elsewhere.
    -->
    <ins
      class="adsbygoogle ad-panel-unit"
      :style="{ display: 'inline-block', width: `${dimensions.width}px`, height: `${dimensions.height}px` }"
      data-ad-client="ca-pub-3329727808516207"
      data-ad-slot="0000000000"
    />
    <span class="ad-panel-scanline" aria-hidden="true" />
  </div>
</template>

<style scoped lang="less">
.ad-panel {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 10px;
  background: var(--jarvis-panel);
  backdrop-filter: blur(16px) saturate(140%);
  -webkit-backdrop-filter: blur(16px) saturate(140%);
  border: 1px solid rgba(34, 211, 238, 0.2);
  box-shadow: 0 0 12px rgba(34, 211, 238, 0.12);
  overflow: hidden;
}

.ad-panel-label {
  font-family: var(--jarvis-font-mono);
  font-size: 9px;
  letter-spacing: 1px;
  color: rgba(124, 147, 168, 0.75);

  .bracket {
    color: var(--jarvis-amber);
  }
}

.ad-panel-unit {
  max-width: 100%;
}

.ad-panel-scanline {
  position: absolute;
  left: 0;
  right: 0;
  top: -30%;
  height: 30%;
  pointer-events: none;
  background: linear-gradient(to bottom, transparent, rgba(34, 211, 238, 0.25), transparent);
  animation: ad-panel-sweep 5s ease-in-out infinite;
}

@keyframes ad-panel-sweep {
  0% {
    top: -30%;
    opacity: 0;
  }
  10% {
    opacity: 0.8;
  }
  90% {
    opacity: 0.8;
  }
  100% {
    top: 100%;
    opacity: 0;
  }
}

.ad-panel.vertical {
  width: fit-content;
}
</style>
