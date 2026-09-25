<script setup lang="ts">
import { IconDragDrop, IconHeart } from '@tabler/icons-vue';
import { useHead } from '@vueuse/head';
import { computed } from 'vue';
import Draggable from 'vuedraggable';
import ColoredCard from '../components/ColoredCard.vue';
import ToolCard from '../components/ToolCard.vue';
import { useToolStore } from '@/tools/tools.store';
import { config } from '@/config';

const toolStore = useToolStore();

useHead({ title: 'IT Tools - Handy online tools for developers' });
const { t } = useI18n();

const favoriteTools = computed(() => toolStore.favoriteTools);

// Update favorite tools order when drag is finished
function onUpdateFavoriteTools() {
  toolStore.updateFavoriteTools(favoriteTools.value); // Update the store with the new order
}
</script>

<template>
  <div class="pt-50px">
    <div class="grid-wrapper jarvis-grid-wrapper">
      <div class="jarvis-centerpiece-radar" aria-hidden="true">
        <svg viewBox="0 0 400 400" width="100%" height="100%">
          <circle cx="200" cy="200" r="196" fill="none" stroke="currentColor" stroke-width="1" />
          <circle cx="200" cy="200" r="150" fill="none" stroke="currentColor" stroke-width="1" />
          <circle cx="200" cy="200" r="104" fill="none" stroke="currentColor" stroke-width="1" />
          <circle cx="200" cy="200" r="58" fill="none" stroke="currentColor" stroke-width="1" />
          <line x1="200" y1="4" x2="200" y2="396" stroke="currentColor" stroke-width="1" />
          <line x1="4" y1="200" x2="396" y2="200" stroke="currentColor" stroke-width="1" />
          <line x1="60" y1="60" x2="340" y2="340" stroke="currentColor" stroke-width="1" />
          <line x1="340" y1="60" x2="60" y2="340" stroke="currentColor" stroke-width="1" />
          <path d="M 200 200 L 200 4 A 196 196 0 0 1 338.6 61.4 Z" fill="currentColor" opacity="0.6" />
        </svg>
      </div>

      <div class="jarvis-radar-sweep" aria-hidden="true" />

      <div class="grid grid-cols-1 gap-12px lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 xl:grid-cols-4">
        <ColoredCard v-if="config.showBanner" :title="$t('home.follow.title')" :icon="IconHeart">
          {{ $t('home.follow.p1') }}
          <a
            href="https://github.com/CorentinTh/it-tools"
            rel="noopener"
            target="_blank"
            :aria-label="$t('home.follow.githubRepository')"
          >GitHub</a>
          {{ $t('home.follow.p2') }}
          <a
            href="https://x.com/ittoolsdottech"
            rel="noopener"
            target="_blank"
            :aria-label="$t('home.follow.twitterXAccount')"
          >X</a>.
          {{ $t('home.follow.thankYou') }}
          <n-icon :component="IconHeart" />
        </ColoredCard>
      </div>

      <transition name="height">
        <div v-if="toolStore.favoriteTools.length > 0">
          <h3 class="jarvis-section-title mb-5px mt-25px">
            {{ $t('home.categories.favoriteTools') }}
            <c-tooltip :tooltip="$t('home.categories.favoritesDndToolTip')">
              <n-icon :component="IconDragDrop" size="18" />
            </c-tooltip>
          </h3>
          <Draggable
            :list="favoriteTools"
            class="jarvis-tool-grid"
            ghost-class="ghost-favorites-draggable"
            item-key="name"
            @end="onUpdateFavoriteTools"
          >
            <template #item="{ element: tool }">
              <ToolCard :tool="tool" />
            </template>
          </Draggable>
        </div>
      </transition>

      <div v-if="toolStore.newTools.length > 0">
        <h3 class="jarvis-section-title mb-5px mt-25px">
          {{ t('home.categories.newestTools') }}
        </h3>
        <div class="jarvis-tool-grid">
          <ToolCard v-for="tool in toolStore.newTools" :key="tool.name" :tool="tool" />
        </div>
      </div>

      <h3 class="jarvis-section-title mb-5px mt-25px">
        {{ $t('home.categories.allTools') }}
      </h3>
      <div class="jarvis-tool-grid">
        <ToolCard v-for="tool in toolStore.tools" :key="tool.name" :tool="tool" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.height-enter-active,
.height-leave-active {
  transition: all 0.5s ease-in-out;
  overflow: hidden;
  max-height: 500px;
}

.height-enter-from,
.height-leave-to {
  max-height: 42px;
  overflow: hidden;
  opacity: 0;
  margin-bottom: 0;
}

.ghost-favorites-draggable {
  opacity: 0.4;
  background-color: #ccc;
  border: 2px dashed #666;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  transform: scale(1.1);
  animation: ghost-favorites-draggable-animation 0.2s ease-out;
}

@keyframes ghost-favorites-draggable-animation {
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  100% {
    opacity: 0.4;
    transform: scale(1.0);
  }
}
</style>
