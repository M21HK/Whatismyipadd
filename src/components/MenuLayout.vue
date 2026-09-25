<script setup lang="ts">
import { useStyleStore } from '@/stores/style.store';

const styleStore = useStyleStore();
const { isMenuCollapsed, isSmallScreen } = toRefs(styleStore);
const siderPosition = computed(() => (isSmallScreen.value ? 'absolute' : 'static'));
</script>

<template>
  <n-layout has-sider>
    <n-layout-sider
      bordered
      collapse-mode="width"
      :collapsed-width="0"
      :width="240"
      :collapsed="isMenuCollapsed"
      :show-trigger="false"
      :native-scrollbar="false"
      :position="siderPosition"
    >
      <slot name="sider" />
    </n-layout-sider>
    <n-layout class="content">
      <slot name="content" />
      <div v-show="isSmallScreen && !isMenuCollapsed" class="overlay" @click="isMenuCollapsed = true" />
    </n-layout>

    <div class="jarvis-scanline-overlay" aria-hidden="true" />
  </n-layout>
</template>

<style lang="less" scoped>
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #00000080;
  cursor: pointer;
}

.content {
  ::v-deep(.n-layout-scroll-container) {
    padding: 26px;
    position: relative;
    background-color: var(--jarvis-bg);
    background-image: linear-gradient(rgba(34, 211, 238, 0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(34, 211, 238, 0.035) 1px, transparent 1px),
      radial-gradient(ellipse at 50% 50%, rgba(4, 9, 17, 0) 0%, rgba(1, 2, 3, 0.5) 62%, rgba(1, 2, 3, 0.97) 100%);
    background-size: 40px 40px, 40px 40px, 100% 100%;
  }
}

.n-layout {
  height: 100vh;
}
</style>
