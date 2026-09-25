import type { GlobalThemeOverrides } from 'naive-ui';

export const lightThemeOverrides: GlobalThemeOverrides = {
  Menu: {
    itemHeight: '32px',
  },

  Layout: { color: '#f1f5f9' },

  AutoComplete: {
    peers: {
      InternalSelectMenu: { height: '500px' },
    },
  },
};

export const darkThemeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#22D3EEFF',
    primaryColorHover: '#67E8F9FF',
    primaryColorPressed: '#0891B2FF',
    primaryColorSuppl: '#67E8F9FF',
    fontFamilyMono: '\'JetBrains Mono\', \'Fira Code\', ui-monospace, monospace',
  },

  Notification: {
    color: 'rgba(6, 12, 22, 0.9)',
    borderRadius: '4px',
  },

  AutoComplete: {
    peers: {
      InternalSelectMenu: { height: '500px', color: 'rgba(4, 9, 17, 0.92)' },
    },
  },

  Menu: {
    itemHeight: '32px',
    itemColorActive: 'rgba(34, 211, 238, 0.12)',
    itemColorActiveHover: 'rgba(34, 211, 238, 0.16)',
    itemTextColor: '#7c93a8',
    itemTextColorHover: '#e6fbff',
    itemTextColorActive: '#22d3ee',
    itemTextColorActiveHover: '#22d3ee',
    itemIconColor: '#7c93a8',
    itemIconColorHover: '#22d3ee',
    itemIconColorActive: '#22d3ee',
    itemIconColorActiveHover: '#22d3ee',
  },

  Layout: {
    color: 'rgba(2, 6, 14, 0.55)',
    siderColor: 'rgba(4, 9, 17, 0.7)',
    siderBorderColor: 'rgba(34, 211, 238, 0.16)',
  },

  Card: {
    color: 'rgba(8, 14, 26, 0.55)',
    borderColor: 'rgba(34, 211, 238, 0.22)',
    borderRadius: '4px',
  },

  Table: {
    tdColor: 'rgba(8, 14, 26, 0.6)',
    thColor: 'rgba(34, 211, 238, 0.08)',
  },

  Input: {
    color: 'rgba(255, 255, 255, 0.03)',
    colorFocus: 'rgba(34, 211, 238, 0.05)',
    border: '1px solid rgba(34, 211, 238, 0.22)',
    borderHover: '1px solid rgba(34, 211, 238, 0.45)',
    borderFocus: '1px solid #22d3ee',
    boxShadowFocus: '0 0 0 2px rgba(34, 211, 238, 0.2)',
    caretColor: '#22d3ee',
  },

  Modal: {
    color: 'rgba(4, 9, 17, 0.85)',
  },
};
