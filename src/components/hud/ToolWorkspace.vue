<script setup lang="ts">
import { ref } from 'vue';
import type { Component } from 'vue';
import DataParsingChart from './DataParsingChart.vue';
import type { Tool } from '@/tools/tools.types';

const props = defineProps<{ tool: Tool; component: Component | null }>();
defineEmits<{ (e: 'close'): void }>();

// The console doesn't know or care what the active tool's markup looks
// like internally - it just listens for typing anywhere inside the
// terminal frame (event delegation, capture phase) and pulses the
// "Data Parsing" chart so it works generically for any of the tools, not
// just Base64 Encoder.
const activityPulse = ref(0);
function onActivity() {
  activityPulse.value += 1;
}
</script>

<template>
  <section class="tool-workspace" :aria-label="`${props.tool.name} command console`">
    <header class="workspace-header">
      <div class="workspace-breadcrumb">
        <span class="prompt">&gt;</span> ACTIVE_PROCESS:
        <span class="workspace-tool-name">{{ tool.name }}</span>
      </div>

      <div class="workspace-status">
        <span class="status-dot" aria-hidden="true" />
        ONLINE
        <button type="button" class="workspace-close" aria-label="Close command console" @click="$emit('close')">
          [ X ]
        </button>
      </div>
    </header>

    <div class="workspace-body">
      <div class="terminal-frame" @input.capture="onActivity" @keydown.capture="onActivity">
        <div class="terminal-frame-scanline" aria-hidden="true" />
        <component :is="component" v-if="component" />
      </div>

      <aside class="workspace-telemetry">
        <DataParsingChart :pulse="activityPulse" />
      </aside>
    </div>
  </section>
</template>

<style scoped lang="less">
.tool-workspace {
  display: flex;
  flex-direction: column;
  gap: 14px;
  flex: 1;
  min-width: 0;
}

.workspace-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  padding: 10px 16px;
  background: rgba(4, 9, 17, 0.6);
  border: 1px solid rgba(34, 211, 238, 0.25);
  clip-path: polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px);
}

.workspace-breadcrumb {
  font-family: var(--jarvis-font-mono);
  font-size: 13px;
  letter-spacing: 0.5px;
  color: #cfe9f1;
  text-transform: uppercase;

  .prompt {
    color: var(--jarvis-amber);
    margin-right: 4px;
  }
}

.workspace-tool-name {
  color: var(--jarvis-cyan);
  text-shadow: 0 0 8px rgba(34, 211, 238, 0.5);
}

.workspace-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--jarvis-font-mono);
  font-size: 11px;
  letter-spacing: 1px;
  color: rgba(124, 147, 168, 0.85);
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--jarvis-cyan);
  box-shadow: 0 0 6px rgba(34, 211, 238, 0.9);
  animation: workspace-blink 1.6s ease-in-out infinite;
}

@keyframes workspace-blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.35;
  }
}

.workspace-close {
  appearance: none;
  background: none;
  border: none;
  padding: 0;
  margin-left: 4px;
  color: rgba(124, 147, 168, 0.85);
  font: inherit;
  font-family: var(--jarvis-font-mono);
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: var(--jarvis-amber);
    text-shadow: 0 0 8px rgba(245, 158, 11, 0.6);
  }
}

.workspace-body {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.terminal-frame {
  position: relative;
  flex: 1;
  min-width: 0;
  padding: 24px;
  background: rgba(2, 6, 12, 0.65);
  backdrop-filter: blur(20px) saturate(140%);
  -webkit-backdrop-filter: blur(20px) saturate(140%);
  border: 1px solid rgba(34, 211, 238, 0.2);
  box-shadow: inset 0 0 40px rgba(34, 211, 238, 0.05), 0 0 20px rgba(34, 211, 238, 0.08);
  overflow: hidden;
}

.terminal-frame-scanline {
  position: absolute;
  left: 0;
  right: 0;
  top: -30%;
  height: 30%;
  pointer-events: none;
  background: linear-gradient(to bottom, transparent, rgba(34, 211, 238, 0.12), transparent);
  animation: workspace-sweep 6s ease-in-out infinite;
}

@keyframes workspace-sweep {
  0% {
    top: -30%;
    opacity: 0;
  }
  10% {
    opacity: 0.7;
  }
  90% {
    opacity: 0.7;
  }
  100% {
    top: 100%;
    opacity: 0;
  }
}

.workspace-telemetry {
  flex: 0 0 190px;
  position: sticky;
  top: 20px;
}

// Restyle the mounted tool's own UI (c-card / c-input-text / c-button, etc.)
// into dark glassmorphic terminal screens without touching each tool file.
.terminal-frame {
  color: #cfe9f1;
  font-family: var(--jarvis-font-mono);

  :deep(.c-card) {
    background: rgba(6, 14, 24, 0.55);
    border: 1px solid rgba(34, 211, 238, 0.2);
    box-shadow: inset 0 0 24px rgba(34, 211, 238, 0.04);
  }

  :deep(.c-card-title) {
    color: var(--jarvis-cyan);
    font-family: var(--jarvis-font-mono);
    text-transform: uppercase;
    letter-spacing: 1px;
    text-shadow: 0 0 6px rgba(34, 211, 238, 0.4);
  }

  :deep(.n-h1),
  :deep(.n-h2),
  :deep(.n-h3),
  :deep(label) {
    font-family: var(--jarvis-font-mono);
    color: #cfe9f1;
  }

  :deep(.input-wrapper) {
    background-color: rgba(2, 6, 12, 0.8) !important;
    border-color: rgba(34, 211, 238, 0.3) !important;
    box-shadow: inset 0 0 12px rgba(34, 211, 238, 0.06);

    &:focus-within {
      border-color: var(--jarvis-cyan) !important;
      box-shadow: 0 0 12px rgba(34, 211, 238, 0.35);
    }
  }

  :deep(.input),
  :deep(textarea),
  :deep(input) {
    font-family: var(--jarvis-font-mono) !important;
    color: var(--jarvis-cyan) !important;
    caret-color: var(--jarvis-cyan);
  }

  :deep(.input::placeholder),
  :deep(textarea::placeholder),
  :deep(input::placeholder) {
    color: rgba(124, 147, 168, 0.55) !important;
  }
}
</style>
