<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useHead } from '@vueuse/head';
import AdPanel from '../components/hud/AdPanel.vue';
import { useToolStore } from '@/tools/tools.store';
import { useStyleStore } from '@/stores/style.store';

useHead({ title: 'WHATISMYIPADD // OPS CENTER' });
const toolStore = useToolStore();
const styleStore = useStyleStore();
const { favoriteTools, toolsByCategory } = storeToRefs(toolStore);
const previousMenuCollapsed = styleStore.isMenuCollapsed;

onMounted(() => {
  if (styleStore.isSmallScreen) styleStore.isMenuCollapsed = true;
});

onBeforeUnmount(() => {
  styleStore.isMenuCollapsed = previousMenuCollapsed;
});
const activeCategory = ref('Network');
const telemetry = ref([42, 58, 38, 72, 54, 66, 48, 78, 61, 70, 52, 64]);
const messages = ref(['UPLINK VERIFIED', 'EDGE NODE 04 RESPONDING', 'PACKET ROUTE OPTIMAL', 'THREAT SCAN: CLEAR']);
let timer: ReturnType<typeof setInterval> | undefined;

onMounted(() => {
  styleStore.isMenuCollapsed = false;
  timer = setInterval(() => {
    telemetry.value = telemetry.value.slice(1).concat(Math.floor(32 + Math.random() * 54));
  }, 1100);
});
onBeforeUnmount(() => { if (timer) clearInterval(timer); });

const categories = computed(() => toolsByCategory.value.filter(category => category.components.length));
const featuredCategories = computed(() => categories.value.filter(category => ['Network', 'Crypto', 'Development', 'Converter', 'Web', 'Data'].includes(category.name)));
</script>

<template>
  <div class="ops-center">
    <header class="ops-header">
      <div class="ops-eyebrow">[ COMMAND // OPERATIONS CENTER ]</div>
      <div class="ops-header-meta"><span class="pulse-dot" /> ALL SYSTEMS NOMINAL <span class="meta-divider">//</span> UTC 04:21:09</div>
    </header>

    <div class="ops-ad-row"><AdPanel variant="horizontal" /></div>

    <main class="ops-grid">
      <aside class="ops-sidebar-panel">
        <div class="panel-label">[ TOOL CATEGORIES ]</div>
        <button v-for="category in categories" :key="category.name" type="button" class="category-row" :class="{ active: activeCategory === category.name }" @click="activeCategory = category.name">
          <span class="category-index">{{ String(categories.indexOf(category) + 1).padStart(2, '0') }}</span>
          <span>{{ category.name }}</span>
          <span class="category-count">{{ category.components.length }}</span>
        </button>
        <div class="sidebar-message-block">
          <div class="panel-label">[ SYSTEM_MESSAGES ]</div>
          <div class="message-feed"><span v-for="message in messages" :key="message">&gt; {{ message }}</span></div>
        </div>
      </aside>

      <section class="ops-tool-panels">
        <div class="section-heading"><span>TOOLKIT REGISTRY</span><span class="section-line" /><span class="section-status">{{ categories.length }} MODULE GROUPS</span></div>
        <article v-for="category in featuredCategories" :key="category.name" class="tool-panel" :class="{ highlighted: activeCategory === category.name }">
          <div class="tool-panel-heading"><span class="bracket">[</span><h2>{{ category.name.toUpperCase() }}_TOOLS</h2><span class="tool-panel-rule" /><span class="tool-panel-count">{{ String(category.components.length).padStart(2, '0') }} NODES</span></div>
          <div class="tool-card-grid">
            <RouterLink v-for="(tool, index) in category.components.slice(0, 8)" :key="tool.path" :to="tool.path" class="ops-tool-card">
              <span class="card-crosshair">+</span><span class="card-code">0x{{ (index * 7919 + category.name.length * 113).toString(16).slice(-4).toUpperCase().padStart(4, '0') }}</span>
              <span class="tool-icon"><n-icon size="20" :component="tool.icon" /></span><span class="tool-name">{{ tool.name }}</span><span class="tool-arrow">→</span>
            </RouterLink>
          </div>
        </article>
      </section>

      <aside class="ops-anchor-column">
        <section class="globe-panel"><div class="panel-label">[ GLOBAL_STATUS ]</div><div class="status-globe"><svg viewBox="0 0 240 240" aria-label="Rotating network status globe"><circle cx="120" cy="120" r="91"/><ellipse cx="120" cy="120" rx="44" ry="91"/><ellipse cx="120" cy="120" rx="78" ry="91"/><ellipse cx="120" cy="120" rx="91" ry="34"/><ellipse cx="120" cy="120" rx="91" ry="67"/><path d="M120 29v182M29 120h182"/><path class="globe-sweep" d="M120 120L120 29A91 91 0 0 1 184 55Z"/></svg><div class="globe-center">IP<br /><strong>ACTIVE</strong></div></div><div class="globe-readout"><span>LATENCY</span><strong>018 MS</strong><span>NODES</span><strong>042 ONLINE</strong></div></section>
        <section class="telemetry-panel"><div class="panel-label">[ SYSTEM_TELEMETRY ]</div><div class="telemetry-row"><span>CPU LOAD</span><strong>{{ telemetry[telemetry.length - 1] }}%</strong></div><svg class="telemetry-chart" viewBox="0 0 240 70" preserveAspectRatio="none"><polyline :points="telemetry.map((value, index) => `${index * 22},${70 - value * 0.65}`).join(' ')" /></svg><div class="telemetry-row"><span>NETWORK LOAD</span><strong class="amber">64.2 Mb/s</strong></div><div class="load-track"><i style="width:64%" /></div><div class="telemetry-row"><span>MEMORY ALLOC</span><strong>38.7%</strong></div><div class="load-track"><i class="amber-fill" style="width:38.7%" /></div></section>
        <AdPanel variant="vertical" />
      </aside>
    </main>
  </div>
</template>

<style scoped lang="less">
.ops-center { position: relative; z-index: 1; min-height: calc(100vh - 60px); padding: 18px 0 48px; color: #c9d9e6; font-family: var(--jarvis-font-mono); }
.ops-header { display:flex; align-items:center; justify-content:space-between; gap:16px; margin-bottom:18px; }
.ops-eyebrow { color:var(--jarvis-cyan); font-size:13px; letter-spacing:1.8px; text-shadow:0 0 12px rgba(34,211,238,.45); }
.ops-header-meta { color:#688096; font-size:10px; letter-spacing:.8px; }.meta-divider { color:var(--jarvis-amber); margin:0 8px; }.pulse-dot { display:inline-block; width:6px; height:6px; margin-right:6px; border-radius:50%; background:var(--jarvis-cyan); box-shadow:0 0 9px var(--jarvis-cyan); animation: pulse 1.6s infinite; }
.ops-ad-row { display:flex; justify-content:center; margin-bottom:18px; }.ops-grid { display:grid; grid-template-columns:190px minmax(420px, 1fr) 300px; gap:16px; align-items:start; }.ops-sidebar-panel,.globe-panel,.telemetry-panel,.tool-panel { border:1px solid rgba(34,211,238,.2); background:rgba(3,9,17,.72); box-shadow:inset 0 0 26px rgba(34,211,238,.025); }.ops-sidebar-panel { min-height:640px; padding:14px 10px; display:flex; flex-direction:column; }.panel-label { color:#658096; font-size:9px; letter-spacing:1.3px; margin-bottom:14px; }.category-row { display:flex; align-items:center; gap:8px; border:0; border-left:2px solid transparent; background:transparent; color:#758ca0; padding:10px 8px; font:inherit; font-size:10px; text-align:left; cursor:pointer; transition:.2s; }.category-row:hover,.category-row.active { color:var(--jarvis-cyan); background:rgba(34,211,238,.08); border-left-color:var(--jarvis-cyan); }.category-index { color:#3c5669; }.category-count { margin-left:auto; color:#4c697d; font-size:9px; }.sidebar-message-block { margin-top:auto; border-top:1px solid rgba(34,211,238,.14); padding-top:14px; }.message-feed { display:flex; flex-direction:column; gap:9px; overflow:hidden; color:#567083; font-size:8px; line-height:1.4; }.message-feed span:first-child { color:#90a8b8; }
.ops-tool-panels { min-width:0; }.section-heading,.tool-panel-heading { display:flex; align-items:center; gap:9px; }.section-heading { margin:0 0 12px; color:var(--jarvis-cyan); font-size:11px; letter-spacing:1.2px; }.section-line,.tool-panel-rule { height:1px; flex:1; background:linear-gradient(90deg,rgba(34,211,238,.45),transparent); }.section-status,.tool-panel-count { color:#526b7d; font-size:8px; letter-spacing:.6px; white-space:nowrap; }.tool-panel { margin-bottom:14px; padding:13px; transition:border-color .25s, box-shadow .25s; }.tool-panel.highlighted { border-color:rgba(34,211,238,.5); box-shadow:0 0 20px rgba(34,211,238,.08),inset 0 0 20px rgba(34,211,238,.035); }.tool-panel-heading { margin-bottom:11px; }.tool-panel-heading h2 { margin:0; color:#a8c2d2; font-size:11px; letter-spacing:1.1px; font-weight:500; }.bracket { color:var(--jarvis-amber); }.tool-card-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:7px; }.ops-tool-card { position:relative; display:grid; grid-template-columns:24px 1fr auto; align-items:center; gap:8px; min-height:54px; padding:9px; overflow:hidden; border:1px solid rgba(34,211,238,.13); background:linear-gradient(110deg,rgba(14,29,42,.75),rgba(4,10,17,.68)); color:#a7bdca; text-decoration:none; clip-path:polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px); transition:.2s; }.ops-tool-card:hover { color:#e5f7fb; border-color:var(--jarvis-cyan); transform:translateX(3px); box-shadow:0 0 20px rgba(34,211,238,.22); }.tool-icon { color:var(--jarvis-cyan); }.tool-name { font-family:var(--jarvis-font-sans); font-size:12px; }.tool-arrow { color:var(--jarvis-amber); }.card-code { position:absolute; top:4px; right:8px; color:#40586a; font-size:7px; }.card-crosshair { position:absolute; bottom:3px; left:5px; color:rgba(34,211,238,.45); font-size:11px; }
.ops-anchor-column { display:flex; flex-direction:column; gap:14px; }.globe-panel,.telemetry-panel { padding:14px; }.status-globe { position:relative; display:grid; place-items:center; margin:4px auto 10px; width:230px; height:230px; color:rgba(34,211,238,.72); }.status-globe svg { width:100%; height:100%; filter:drop-shadow(0 0 10px rgba(34,211,238,.2)); animation: globe-spin 24s linear infinite; }.status-globe circle,.status-globe ellipse,.status-globe path { fill:none; stroke:currentColor; stroke-width:.65; }.status-globe .globe-sweep { fill:rgba(34,211,238,.18); stroke:var(--jarvis-cyan); }.globe-center { position:absolute; text-align:center; color:#6d8ba0; font-size:10px; letter-spacing:1px; }.globe-center strong { color:var(--jarvis-cyan); font-size:8px; }.globe-readout { display:grid; grid-template-columns:1fr auto; gap:6px; color:#5f7889; font-size:8px; }.globe-readout strong { color:#a8c4d2; font-weight:500; text-align:right; }.telemetry-row { display:flex; justify-content:space-between; color:#6a8191; font-size:8px; margin:12px 0 6px; }.telemetry-row strong { color:var(--jarvis-cyan); font-weight:500; }.telemetry-row .amber { color:var(--jarvis-amber); }.telemetry-chart { width:100%; height:70px; border-bottom:1px solid rgba(34,211,238,.16); background:repeating-linear-gradient(0deg,transparent 0 16px,rgba(34,211,238,.06) 17px); }.telemetry-chart polyline { fill:none; stroke:var(--jarvis-cyan); stroke-width:1.5; filter:drop-shadow(0 0 4px rgba(34,211,238,.6)); }.load-track { height:4px; background:rgba(109,139,160,.12); }.load-track i { display:block; height:100%; background:var(--jarvis-cyan); box-shadow:0 0 7px rgba(34,211,238,.7); }.load-track .amber-fill { background:var(--jarvis-amber); box-shadow:0 0 7px rgba(245,158,11,.65); }
@keyframes globe-spin { to { transform:rotate(360deg); } } @keyframes pulse { 50% { opacity:.35; transform:scale(.72); } }
@media (max-width:1200px) { .ops-grid { grid-template-columns:170px minmax(360px,1fr) 260px; }.status-globe { width:190px; height:190px; }.ops-tool-card { min-height:50px; }.tool-name { font-size:11px; } }
@media (max-width:900px) { .ops-header { align-items:flex-start; flex-direction:column; }.ops-grid { grid-template-columns:1fr; }.ops-sidebar-panel { min-height:0; }.sidebar-message-block { margin-top:18px; }.ops-anchor-column { display:grid; grid-template-columns:1fr 1fr; }.ops-anchor-column :deep(.ad-panel-vertical) { grid-column:1 / -1; }.tool-card-grid { grid-template-columns:repeat(2,minmax(0,1fr)); } }
@media (max-width:560px) { .tool-card-grid,.ops-anchor-column { grid-template-columns:1fr; }.section-status { display:none; }.ops-center { padding-inline:4px; } }
</style>
