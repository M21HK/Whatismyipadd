<script setup lang="ts">
import { useHead } from '@vueuse/head';
import SystemCoreFooter from '@/components/SystemCoreFooter.vue';

useHead({ title: 'About whatismyipadd.com' });
</script>

<template>
  <div class="about-page jarvis-about-page">
    <main class="jarvis-about-content">
      <section class="jarvis-about-block">
        <h1 class="jarvis-about-heading">About whatismyipadd.com</h1>
        <p class="jarvis-about-copy">
          This tactical utility suite aggregates essential tools for developers and network specialists. Originally engineered by Corentin Thomasset and released under the open-source GPL-3.0 license, this platform is hosted and modified by whatismyipadd.com. To support server upkeep and future module deployments, please consider
          <a class="jarvis-about-link jarvis-about-link--amber" href="https://buymeacoffee.com/reyc" target="_blank" rel="noreferrer">sponsoring the operator</a>.
        </p>
      </section>

      <section class="jarvis-about-block">
        <h2 class="jarvis-about-heading">[ SYSTEM_ARCHITECTURE ]</h2>
        <p class="jarvis-about-copy">
          The core interface is built with Vue.js (Vue 3) and the Naive UI component library, continuously deployed via Vercel. Execution happens locally within your browser to maximize speed and data privacy.
        </p>
      </section>

      <section class="jarvis-about-block">
        <h2 class="jarvis-about-heading">[ TELEMETRY_&amp;_FEEDBACK ]</h2>
        <p class="jarvis-about-copy">
          If you require a specific utility not currently on the grid, or if you encounter an anomaly within the system, please submit a diagnostic report or feature request via our
          <a class="jarvis-about-link" href="#support">primary support channel</a>.
        </p>
      </section>
    </main>
    <SystemCoreFooter />
  </div>
</template>

<style scoped>
.jarvis-about-page {
  width: min(100%, 720px);
  margin: 0 auto;
  padding: 48px 24px 64px;
}

.jarvis-about-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.jarvis-about-block {
  border-left: 1px solid var(--jarvis-cyan-soft);
  padding: 20px 24px;
  background: rgba(6, 12, 22, 0.34);
  backdrop-filter: blur(12px);
}

.jarvis-about-heading {
  margin: 0 0 12px;
  color: var(--jarvis-cyan);
  font-family: var(--jarvis-font-mono);
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-shadow: 0 0 8px rgba(34, 211, 238, 0.3);
}

.jarvis-about-copy {
  margin: 0;
  color: rgb(203 213 225);
  font-family: var(--jarvis-font-mono);
  font-size: 13px;
  line-height: 1.8;
}

.jarvis-about-link {
  color: var(--jarvis-cyan);
  text-decoration: underline;
  text-decoration-color: rgba(34, 211, 238, 0.35);
  text-underline-offset: 3px;
  transition: color 160ms ease, text-shadow 160ms ease;
}

.jarvis-about-link:hover,
.jarvis-about-link:focus-visible {
  color: var(--jarvis-cyan);
  text-shadow: 0 0 8px rgba(34, 211, 238, 0.8);
}

.jarvis-about-link--amber {
  color: var(--jarvis-amber);
  text-decoration-color: rgba(245, 158, 11, 0.45);
}

.jarvis-about-link--amber:hover,
.jarvis-about-link--amber:focus-visible {
  color: var(--jarvis-amber);
  text-shadow: 0 0 8px rgba(245, 158, 11, 0.8);
}

@media (max-width: 640px) {
  .jarvis-about-page {
    padding: 32px 16px 48px;
  }

  .jarvis-about-block {
    padding: 16px;
  }

  .jarvis-about-copy {
    font-size: 12px;
  }
}
</style>
