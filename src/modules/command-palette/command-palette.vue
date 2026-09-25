<script setup lang="ts">
import { storeToRefs } from 'pinia';
import _ from 'lodash';
import { useCommandPaletteStore } from './command-palette.store';
import type { PaletteOption } from './command-palette.types';

const isModalOpen = ref(false);
const isGlitching = ref(false);
const inputRef = ref();
const router = useRouter();
const isMac = computed(() => window.navigator.userAgent.toLowerCase().includes('mac'));

const commandPaletteStore = useCommandPaletteStore();
const { searchPrompt, filteredSearchResult } = storeToRefs(commandPaletteStore);

const keys = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (e.ctrlKey && e.key === 'k' && e.type === 'keydown') {
      e.preventDefault();
    }

    if (e.metaKey && e.key === 'k' && e.type === 'keydown') {
      e.preventDefault();
    }
  },
});

whenever(isModalOpen, () => inputRef.value?.focus());

whenever(keys.ctrl_k, open);
whenever(keys.meta_k, open);
whenever(keys.escape, close);

function open() {
  if (isGlitching.value) {
    return;
  }

  isGlitching.value = true;

  setTimeout(() => {
    isGlitching.value = false;
    isModalOpen.value = true;
  }, 180);
}

function close() {
  isModalOpen.value = false;
  searchPrompt.value = '';
}

const selectedOptionIndex = ref(0);

function handleKeydown(event: KeyboardEvent) {
  const { key } = event;
  const isEnterPressed = key === 'Enter';
  const isArrowUpOrDown = ['ArrowUp', 'ArrowDown'].includes(key);
  const isArrowDown = key === 'ArrowDown';

  if (isArrowUpOrDown) {
    const increment = isArrowDown ? 1 : -1;
    const maxIndex = Math.max(_.chain(filteredSearchResult.value).values().flatten().size().value() - 1, 0);

    selectedOptionIndex.value = Math.min(Math.max(selectedOptionIndex.value + increment, 0), maxIndex);

    return;
  }

  if (isEnterPressed) {
    const option = _.chain(filteredSearchResult.value)
      .values()
      .flatten()
      .nth(selectedOptionIndex.value)
      .value();

    activateOption(option);
  }
}

function getOptionIndex(option: PaletteOption) {
  return _.chain(filteredSearchResult.value)
    .values()
    .flatten()
    .findIndex(o => o === option)
    .value();
}

function activateOption(option: PaletteOption) {
  const { closeOnSelect } = option;

  if (option.action) {
    option.action();

    if (closeOnSelect) {
      close();
    }

    return;
  }

  const closeAfterNavigation = closeOnSelect || _.isUndefined(closeOnSelect);

  if (option.to) {
    router.push(option.to);

    if (closeAfterNavigation) {
      close();
    }
    return;
  }

  if (option.href) {
    window.open(option.href, '_blank');

    if (closeAfterNavigation) {
      close();
    }
  }
}
</script>

<template>
  <div flex-1>
    <c-button w-full important:justify-start class="query-trigger" @click="open">
      <span flex items-center gap-2 w-full>
        <span class="console-bracket" aria-hidden="true">&gt;</span>

        <span class="console-input-area">
          <span class="console-placeholder" :class="{ 'is-glitching': isGlitching }" :data-text="$t('search.label')">
            {{ isGlitching ? '█▓▒░01░▓█_CMD_ERR░▒▓█' : 'AWAITING_COMMAND_INPUT_' }}
          </span>
          <span class="terminal-cursor" aria-hidden="true" />
        </span>

        <span class="console-bracket" aria-hidden="true">&lt;</span>

        <span hidden flex-1 border border-current border-op-40 rounded border-solid px-5px py-3px sm:inline class="query-shortcut">
          {{ isMac ? 'Cmd' : 'Ctrl' }}&nbsp;+&nbsp;K
        </span>
      </span>
    </c-button>

    <c-modal v-model:open="isModalOpen" class="palette-modal" shadow-xl important:max-w-650px important:pa-12px @keydown="handleKeydown">
      <div class="terminal-input-wrapper">
        <span class="terminal-input-prompt">&gt;_</span>
        <c-input-text ref="inputRef" v-model:value="searchPrompt" raw-text placeholder="AWAITING_COMMAND_INPUT_" autofocus clearable />
      </div>

      <div v-for="(options, category) in filteredSearchResult" :key="category">
        <div ml-3 mt-3 text-sm font-bold text-primary op-60>
          {{ category }}
        </div>
        <command-palette-option v-for="option in options" :key="option.name" :option="option" :selected="selectedOptionIndex === getOptionIndex(option)" @activated="activateOption" />
      </div>
    </c-modal>
  </div>
</template>

<style scoped lang="less">
.query-trigger {
  font-family: var(--jarvis-font-mono);
  border: none !important;
  background: transparent !important;
  transition: filter 0.15s ease;

  &:hover {
    filter: brightness(1.15);
  }
}

.console-bracket {
  color: var(--jarvis-cyan);
  font-weight: 700;
  font-size: 20px;
  line-height: 1;
  text-shadow:
    0 0 4px var(--jarvis-cyan),
    0 0 10px var(--jarvis-cyan),
    0 0 18px rgba(34, 211, 238, 0.6);
  transition: text-shadow 0.15s ease;
}

.query-trigger:hover .console-bracket {
  text-shadow:
    0 0 6px var(--jarvis-cyan),
    0 0 16px var(--jarvis-cyan),
    0 0 28px rgba(34, 211, 238, 0.8);
}

.console-input-area {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  padding: 4px 10px;
  border-top: 1px solid rgba(34, 211, 238, 0.18);
  border-bottom: 1px solid rgba(34, 211, 238, 0.18);
  background: rgba(34, 211, 238, 0.03);
}

.console-placeholder {
  color: #7c93a8;
  letter-spacing: 0.5px;
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &.is-glitching {
    color: var(--jarvis-amber);
    animation: jarvis-glitch 0.18s steps(2, jump-none) infinite;
    text-shadow:
      2px 0 rgba(34, 211, 238, 0.8),
      -2px 0 rgba(245, 158, 11, 0.8);
  }
}

.terminal-cursor {
  display: inline-block;
  width: 7px;
  height: 15px;
  background: var(--jarvis-cyan);
  box-shadow: 0 0 6px var(--jarvis-cyan);
  animation: jarvis-blink 1s steps(1) infinite;
}

.query-shortcut {
  font-family: var(--jarvis-font-mono);
  color: var(--jarvis-amber);
  border-color: rgba(245, 158, 11, 0.4) !important;
}

.terminal-input-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;

  .terminal-input-prompt {
    color: var(--jarvis-cyan);
    font-family: var(--jarvis-font-mono);
    font-weight: 700;
    font-size: 18px;
  }

  .c-input-text {
    flex: 1;
  }
}

.c-input-text {
  font-size: 18px;
  font-family: var(--jarvis-font-mono);

  ::v-deep(.input-wrapper) {
      padding: 4px;
      padding-left: 18px;
  }
}

.c-modal--overlay {
  align-items: flex-start !important;
  padding-top: 80px;
}

@keyframes jarvis-blink {
  0%, 50% {
    opacity: 1;
  }
  50.01%, 100% {
    opacity: 0;
  }
}

@keyframes jarvis-glitch {
  0% {
    transform: translate(0, 0);
    opacity: 1;
  }
  20% {
    transform: translate(-2px, 1px);
    opacity: 0.7;
  }
  40% {
    transform: translate(2px, -1px);
    opacity: 1;
  }
  60% {
    transform: translate(-1px, 0);
    opacity: 0.6;
  }
  80% {
    transform: translate(1px, 1px);
    opacity: 1;
  }
  100% {
    transform: translate(0, 0);
    opacity: 0.85;
  }
}
</style>
