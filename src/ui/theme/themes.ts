import { defineThemes } from './theme.models';

export const { themes: appThemes, useTheme: useAppTheme } = defineThemes({
  light: {
    background: '#ffffff',
    text: {
      baseColor: '#333639',
      mutedColor: '#767c82',
    },
    default: {
      color: 'rgba(46, 51, 56, 0.05)',
      colorHover: 'rgba(46, 51, 56, 0.09)',
      colorPressed: 'rgba(46, 51, 56, 0.22)',
    },
    primary: {
      color: '#18a058',
      colorHover: '#1ea54c',
      colorPressed: '#0C7A43',
      colorFaded: '#18a0582f',
    },
    warning: {
      color: '#f59e0b',
      colorHover: '#f59e0b',
      colorPressed: '#f59e0b',
      colorFaded: '#f59e0b2f',
    },
    success: {
      color: '#18a058',
      colorHover: '#36ad6a',
      colorPressed: '#0c7a43',
      colorFaded: '#18a0582f',
    },
    error: {
      color: '#d03050',
      colorHover: '#de576d',
      colorPressed: '#ab1f3f',
      colorFaded: '#d030502a',
    },
  },
  dark: {
    background: '#04060a',
    text: {
      baseColor: '#e6fbff',
      mutedColor: '#7c93a8',
    },
    default: {
      color: 'rgba(34, 211, 238, 0.06)',
      colorHover: 'rgba(34, 211, 238, 0.12)',
      colorPressed: 'rgba(34, 211, 238, 0.22)',
    },
    primary: {
      color: '#22d3ee',
      colorHover: '#67e8f9',
      colorPressed: '#0891b2',
      colorFaded: 'rgba(34, 211, 238, 0.16)',
    },
    warning: {
      color: '#f59e0b',
      colorHover: '#fbbf24',
      colorPressed: '#b45309',
      colorFaded: 'rgba(245, 158, 11, 0.16)',
    },
    success: {
      color: '#34d399',
      colorHover: '#6ee7b7',
      colorPressed: '#059669',
      colorFaded: 'rgba(52, 211, 153, 0.16)',
    },
    error: {
      color: '#fb7185',
      colorHover: '#fda4af',
      colorPressed: '#e11d48',
      colorFaded: 'rgba(251, 113, 133, 0.16)',
    },
  },
});
