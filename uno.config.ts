import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup
} from 'unocss'

export default defineConfig({
  shortcuts: [
    ['fcc', 'flex justify-center items-center'],
    [/^btn-(\w+)$/, ([_, color]) => `op50 px2.5 py1 transition-all duration-200 ease-out no-underline! hover:(op100 text-${color} bg-${color}/10) border border-base! rounded`],
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1,
      warn: true,
    }),
    presetTypography({
      cssExtend: {
        'code': {
          color: '#111827',
          'font-weight': '600',
          'font-size': '0.875em',
          'padding': '0.2em 0.4em',
          'background-color': '#f3f4f6',
          'border-radius': '0.25rem',
        },
        'code::before': {
          content: '""'
        },
        'code::after': {
          content: '""'
        },
        'a': {
          color: '#000000',
          'text-decoration': 'none',
          'font-weight': '500',
        },
        'a:hover': {
          color: '#333333',
        },
        '.dark code': {
          color: '#ffffff',
          'background-color': '#2a2a2a',
        },
        '.dark a': {
          color: '#ffffff',
        },
        '.dark a:hover': {
          color: '#cccccc',
        },
      }
    }),
    presetWebFonts({
      fonts: {
        sans: 'DM Sans',
        serif: 'DM Serif Display',
        mono: 'DM Mono',
      },
    }),
  ],
  preflights: [
    {
      getCSS: () => `
        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        body {
          margin: 0;
          line-height: inherit;
        }
        a {
          color: inherit;
          text-decoration: none;
        }
      `
    }
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
})