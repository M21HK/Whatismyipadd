<template>
  <section class="system-core" aria-labelledby="system-core-title">
    <div id="system-core-title" class="system-core__heading">[ SYSTEM CORE &amp; LICENSING ]</div>
    <div class="system-core__readout">
      <p>[ CORE_ARCHITECTURE ] : Originally engineered by Corentin Thomasset.</p>
      <p>[ LICENSE_PROTOCOL ] : Operating under GPL-3.0 Open-Source License.</p>
      <p>[ UI_MODIFICATION ] : Tactical interface overhaul by whatismyipadd.com.</p>
    </div>
    <a
      class="system-core__license"
      href="https://www.gnu.org/licenses/gpl-3.0.html"
      target="_blank"
      rel="noopener noreferrer"
    >
      [ VIEW LICENSE ]
    </a>
  </section>
</template>

<style scoped lang="less">
.system-core {
  position: relative;
  margin: 44px auto 24px;
  padding: 16px 18px;
  max-width: 680px;
  border: 1px solid rgba(34, 211, 238, 0.16);
  background: rgba(2, 8, 23, 0.42);
  color: #64748b;
  font-family: var(--jarvis-font-mono);
  font-size: 11px;
  line-height: 1.8;
  letter-spacing: 0.04em;
  transition: color 180ms ease, border-color 180ms ease, box-shadow 180ms ease;

  &:hover,
  &:focus-within {
    color: var(--jarvis-cyan);
    border-color: rgba(34, 211, 238, 0.42);
    box-shadow: 0 0 18px rgba(34, 211, 238, 0.08);

    .system-core__license {
      opacity: 1;
      transform: translateX(0);
    }
  }
}

.system-core__heading {
  margin-bottom: 8px;
  color: #456276;
  font-weight: 700;
  letter-spacing: 0.12em;
}

.system-core__readout p {
  margin: 0;
}

.system-core__license {
  display: inline-block;
  margin-top: 12px;
  padding: 2px 8px;
  border: 1px solid rgba(34, 211, 238, 0.35);
  color: var(--jarvis-cyan);
  opacity: 0.18;
  text-decoration: none;
  transform: translateX(-4px);
  transition: opacity 180ms ease, transform 180ms ease, box-shadow 180ms ease;

  &:hover,
  &:focus-visible {
    opacity: 1;
    box-shadow: 0 0 10px rgba(34, 211, 238, 0.3);
    outline: none;
  }
}

@media (max-width: 600px) {
  .system-core {
    margin: 32px 16px 20px;
    padding: 14px;
    font-size: 10px;
    overflow-wrap: anywhere;
  }
}
</style>
