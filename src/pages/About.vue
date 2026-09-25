<script setup lang="ts">
import { useHead } from '@vueuse/head';
import SystemCoreFooter from '@/components/SystemCoreFooter.vue';

useHead({ title: 'About - IT Tools' });
</script>

<template>
  <div class="about-page">
    <c-markdown :markdown="$t('about.content')" mx-auto mt-50px max-w-600px />
    <SystemCoreFooter />
  </div>
</template>
