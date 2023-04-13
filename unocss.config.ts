import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      scale: 1,
      warn: true,
      cdn: 'https://esm.sh/',
    }),
    presetWebFonts({
      fonts: {
        sans: 'DM Sans',
        serif: ['PingFang SC', 'Microsoft YaHei'],
        mono: 'DM Mono',
      },
    }),
    presetAttributify({
      prefix: 'u-',
      prefixedOnly: true,
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  shortcuts: {
    'sticky-top': 'sticky top-0',
    'sticky-bottom': 'sticky bottom-0',
    'flex-center': 'flex items-center justify-center',
    // icons
    'i-add': 'i-material-symbols:add-circle',
    'i-edit': 'i-mdi:edit-circle',
    'i-import': 'i-raphael:import',
    'i-apply': 'i-ic:baseline-add-task',
  },
  rules: [
    ['text-primary', { color: 'var(--el-color-primary)' }],
  ],
  safelist: [
    'i-system-uicons:grid-small',
    'i-system-uicons:settings',
    'i-system-uicons:users',
    'i-system-uicons:grid-circles',
    'i-healthicons:truck-driver-outline',
    'i-mdi:drivers-license-outline',
    'i-fluent:vehicle-car-profile-ltr-20-regular',
    'i-fluent:vehicle-car-profile-rtl-20-regular',
    'i-mdi:file-document-outline',
    'i-mdi:receipt-text-pending',
    'i-gridicons:reader-follow',
    'i-ic:baseline-car-rental',
    'i-mdi:file-document-check-outline',
  ],
})
