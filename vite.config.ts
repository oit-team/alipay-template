/// <reference types="vitest" />

import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Unocss from 'unocss/vite'
import Layouts from 'vite-plugin-vue-layouts'
import VueJsx from '@vitejs/plugin-vue-jsx'
import Eslint from 'vite-plugin-eslint'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

const registryComponents = [
  'Form',
  'FormLayout',
  'Submit',
]

function FormilyElementPlusResolver() {
  return (name: string) => {
    if (registryComponents.includes(name))
      return { name, from: '@formily/element-plus' }
  }
}

export default (mode: string) => {
  const env = loadEnv(mode, process.cwd())

  return defineConfig({
    server: {
      port: 4444,
      host: true,
      proxy: {
        '/api': {
          target: env.VITE_APP_API,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
        },
      },
    },
    resolve: {
      alias: {
        '@/': `${path.resolve(__dirname, 'src')}/`,
        '~/': `${path.resolve(__dirname, 'src')}/`,
      },
    },
    plugins: [
      Vue({
        reactivityTransform: true,
      }),
      VueJsx(),
      // https://github.com/hannoeru/vite-plugin-pages
      Pages({
        exclude: ['**/components/*.*'],
        routeBlockLang: 'yaml',
      }),
      // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
      Layouts(),
      // https://github.com/antfu/unplugin-auto-import
      AutoImport({
        imports: [
          'vue',
          'vue/macros',
          'vue-router',
          '@vueuse/core',
          {
            '@formily/core': [
              'createForm',
            ],
          },
          {
            '@vueuse/integrations/useAxios': ['useAxios'],
          },
          {
            axios: [
              ['default', 'axios'],
            ],
          },
        ],
        resolvers: [
          ElementPlusResolver({
            importStyle: false,
          }),
        ],
        dts: true,
        dirs: [
          './src/composables',
        ],
        vueTemplate: true,
      }),
      // https://github.com/antfu/vite-plugin-components
      Components({
        dts: true,
        resolvers: [
          ElementPlusResolver({
            importStyle: false,
          }),
          FormilyElementPlusResolver(),
        ],
        types: [{
          from: '@uxuip/element-plus-query',
          names: [
            'QueryProvide',
            'QueryForm',
            'QueryTable',
            'QueryPagination',
          ],
        }],
        include: [/\.vue$/, /\.vue\?vue/, /\.tsx$/],
      }),
      // https://github.com/antfu/unocss
      // see unocss.config.ts for config
      Unocss(),
      Eslint(),
    ],

    // https://github.com/vitest-dev/vitest
    test: {
      environment: 'jsdom',
    },
  })
}
