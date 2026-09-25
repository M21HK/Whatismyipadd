<script setup lang="ts">
import { IconTarget } from '@tabler/icons-vue';
import { onBeforeUnmount, ref, toRefs } from 'vue';
import type { Tool } from '@/tools/tools.types';
import { useToolStore } from '@/tools/tools.store';

const props = defineProps<{ tool: Tool & { category: string } }>();
const { tool } = toRefs(props);

const toolStore = useToolStore();
const isFavorite = computed(() => toolStore.isToolFavorite({ tool: tool.value }));

function togglePin(event: MouseEvent) {
  event.preventDefault();

  if (toolStore.isToolFavorite({ tool: tool.value })) {
    toolStore.removeToolFromFavorites({ tool: tool.value });
    return;
  }

  toolStore.addToolToFavorites({ tool: tool.value });
}

// "Data decryption" flash effect: a short burst of randomized hex characters
// next to the title while the card is hovered.
const HEX_CHARS = '0123456789ABCDEF';
const decryptText = ref('');
let decryptTimer: ReturnType<typeof setInterval> | null = null;

function randomHex(length = 6) {
  return Array.from({ length }, () => HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)]).join('');
}

function startDecrypt() {
  stopDecrypt();
  let ticks = 0;
  decryptTimer = setInterval(() => {
    decryptText.value = randomHex();
    ticks += 1;
    if (ticks > 5) {
      stopDecrypt();
    }
  }, 90);
}

function stopDecrypt() {
  if (decryptTimer) {
    clearInterval(decryptTimer);
    decryptTimer = null;
  }
  decryptText.value = '';
}

onBeforeUnmount(stopDecrypt);
</script>

<template>
  <router-link
    :to="tool.path"
    class="decoration-none jarvis-tool-link"
    @mouseenter="startDecrypt"
    @mouseleave="stopDecrypt"
  >
    <div class="jarvis-tool-card h-full">
      <button
        type="button"
        class="jarvis-pin"
        :class="{ 'jarvis-pin--active': isFavorite }"
        :aria-label="isFavorite ? $t('favoriteButton.remove') : $t('favoriteButton.add')"
        @click="togglePin"
      >
        <IconTarget :size="15" :stroke-width="2" />
      </button>

      <div class="jarvis-tool-icon-row">
        <n-icon class="jarvis-tool-icon" size="30" :component="tool.icon" />
        <span v-if="tool.isNew" class="jarvis-new-badge">{{ $t('toolCard.new') }}</span>
      </div>

      <div class="jarvis-tool-title-row">
        <span class="jarvis-tool-title">{{ tool.name }}</span>
        <span class="jarvis-decrypt">{{ decryptText }}</span>
      </div>

      <p class="jarvis-tool-desc">
        {{ tool.description }}
      </p>
    </div>
  </router-link>
</template>

<style lang="less" scoped>
.jarvis-tool-link {
  display: block;
  height: 100%;
}

.jarvis-tool-card {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px 18px;
  border: 1px solid rgba(34, 211, 238, 0.22);
  background: var(--jarvis-panel);
  backdrop-filter: blur(16px) saturate(140%);
  -webkit-backdrop-filter: blur(16px) saturate(140%);
  border-radius: 2px;
  transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(34, 211, 238, 0.08), transparent 45%);
    opacity: 0;
    transition: opacity 0.25s ease;
    pointer-events: none;
  }

  &:hover {
    border-color: var(--jarvis-cyan);
    box-shadow: 0 0 15px rgba(34, 211, 238, 0.3);
    transform: translateY(-1px);

    &::before {
      opacity: 1;
    }
  }
}

.jarvis-pin {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border: 1px solid rgba(34, 211, 238, 0.3);
  background: rgba(4, 9, 17, 0.6);
  color: rgba(34, 211, 238, 0.45);
  cursor: pointer;
  clip-path: polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%);
  transition: color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;

  &:hover {
    color: var(--jarvis-cyan);
    border-color: var(--jarvis-cyan);
    box-shadow: 0 0 8px rgba(34, 211, 238, 0.5);
    transform: scale(1.08);
  }

  &--active {
    color: var(--jarvis-amber);
    border-color: rgba(245, 158, 11, 0.6);
    box-shadow: 0 0 8px rgba(245, 158, 11, 0.45);
  }
}

.jarvis-tool-icon-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 24px;
}

.jarvis-tool-icon {
  color: var(--jarvis-cyan);
  filter: drop-shadow(0 0 4px rgba(34, 211, 238, 0.4));
  transition: transform 0.4s ease;
}

.jarvis-tool-card:hover .jarvis-tool-icon {
  animation: jarvis-icon-pulse 1.1s ease-in-out infinite;
}

@keyframes jarvis-icon-pulse {
  0%,
  100% {
    transform: rotate(0deg) scale(1);
  }
  50% {
    transform: rotate(8deg) scale(1.1);
  }
}

.jarvis-new-badge {
  font-family: var(--jarvis-font-mono);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: var(--jarvis-black);
  background-color: var(--jarvis-amber);
  padding: 2px 6px;
  border-radius: 2px;
}

.jarvis-tool-title-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
  min-width: 0;
}

.jarvis-tool-title {
  font-family: var(--jarvis-font-mono);
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: #eaf7fb;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.jarvis-decrypt {
  font-family: var(--jarvis-font-mono);
  font-size: 10px;
  letter-spacing: 1px;
  color: var(--jarvis-cyan);
  text-shadow: 0 0 6px rgba(34, 211, 238, 0.6);
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.15s ease;
}

.jarvis-tool-card:hover .jarvis-decrypt {
  opacity: 0.85;
}

.jarvis-tool-desc {
  margin: 0;
  font-size: 12.5px;
  line-height: 1.5;
  color: #7c93a8;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
