// vite.config.ts
import path from "path";
import { defineConfig, loadEnv } from "file:///F:/work/car-rental-manage/node_modules/.pnpm/vite@4.1.4_wlyq37gek244gc22rfb2kn6efu/node_modules/vite/dist/node/index.js";
import Vue from "file:///F:/work/car-rental-manage/node_modules/.pnpm/@vitejs+plugin-vue@4.0.0_vite@4.1.4+vue@3.2.47/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import Pages from "file:///F:/work/car-rental-manage/node_modules/.pnpm/vite-plugin-pages@0.28.0_vite@4.1.4/node_modules/vite-plugin-pages/dist/index.mjs";
import Components from "file:///F:/work/car-rental-manage/node_modules/.pnpm/unplugin-vue-components@0.24.0_vue@3.2.47/node_modules/unplugin-vue-components/dist/vite.mjs";
import AutoImport from "file:///F:/work/car-rental-manage/node_modules/.pnpm/unplugin-auto-import@0.15.0_@vueuse+core@9.13.0/node_modules/unplugin-auto-import/dist/vite.js";
import Unocss from "file:///F:/work/car-rental-manage/node_modules/.pnpm/unocss@0.50.3_vite@4.1.4/node_modules/unocss/dist/vite.mjs";
import Layouts from "file:///F:/work/car-rental-manage/node_modules/.pnpm/vite-plugin-vue-layouts@0.8.0_s7i5cn7xswa4rctkzerr3e4clm/node_modules/vite-plugin-vue-layouts/dist/index.mjs";
import VueJsx from "file:///F:/work/car-rental-manage/node_modules/.pnpm/@vitejs+plugin-vue-jsx@3.0.0_vite@4.1.4+vue@3.2.47/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import Eslint from "file:///F:/work/car-rental-manage/node_modules/.pnpm/vite-plugin-eslint@1.8.1_eslint@8.35.0+vite@4.1.4/node_modules/vite-plugin-eslint/dist/index.mjs";
import VueI18n from "file:///F:/work/car-rental-manage/node_modules/.pnpm/@intlify+unplugin-vue-i18n@0.9.1_vue-i18n@9.2.2/node_modules/@intlify/unplugin-vue-i18n/lib/vite.mjs";
import Icons from "file:///F:/work/car-rental-manage/node_modules/.pnpm/unplugin-icons@0.15.3/node_modules/unplugin-icons/dist/vite.mjs";
import IconsResolver from "file:///F:/work/car-rental-manage/node_modules/.pnpm/unplugin-icons@0.15.3/node_modules/unplugin-icons/dist/resolver.mjs";
import { ElementPlusResolver } from "file:///F:/work/car-rental-manage/node_modules/.pnpm/unplugin-vue-components@0.24.0_vue@3.2.47/node_modules/unplugin-vue-components/dist/resolvers.mjs";
var __vite_injected_original_dirname = "F:\\work\\car-rental-manage";
var ComponentsImports = {
  "@formily/element-plus": [
    "Form",
    "FormLayout",
    "FormButtonGroup",
    "FormItem",
    "Input",
    "InputNumber",
    "Password",
    "Submit",
    "Switch",
    "ArrayTable",
    "Space",
    "PreviewText"
  ],
  "@formily/vue": [
    "FormProvider",
    "Field",
    "ArrayField",
    "VoidField"
  ]
};
function ComponentsResolver() {
  return (name) => {
    for (const [from, imports] of Object.entries(ComponentsImports)) {
      if (imports.includes(name))
        return { name, from };
    }
  };
}
var vite_config_default = (mode) => {
  const env = loadEnv(mode, process.cwd());
  return defineConfig({
    server: {
      port: 4444,
      host: true,
      proxy: {
        "/api": {
          target: env.VITE_APP_API,
          changeOrigin: true,
          rewrite: (path2) => path2.replace(/^\/api/, "")
        }
      }
    },
    resolve: {
      alias: {
        "@/": `${path.resolve(__vite_injected_original_dirname, "src")}/`,
        "~/": `${path.resolve(__vite_injected_original_dirname, "src")}/`
      }
    },
    plugins: [
      Vue({
        reactivityTransform: true
      }),
      VueJsx(),
      // https://github.com/hannoeru/vite-plugin-pages
      Pages({
        exclude: ["**/components/*.*"],
        routeBlockLang: "yaml"
      }),
      // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
      Layouts(),
      // https://github.com/antfu/unplugin-auto-import
      AutoImport({
        imports: [
          "vue",
          "vue-router",
          "vue-i18n",
          "@vueuse/core",
          {
            "@formily/core": [
              "createForm"
            ],
            "@vueuse/integrations/useAxios": ["useAxios"],
            "axios": [
              ["default", "axios"]
            ]
          },
          ComponentsImports
        ],
        resolvers: [
          ElementPlusResolver({
            importStyle: false
          })
        ],
        dts: true,
        dirs: [
          "./src/composables"
        ],
        vueTemplate: true
      }),
      // https://github.com/antfu/vite-plugin-components
      Components({
        dts: true,
        resolvers: [
          ElementPlusResolver({
            importStyle: false
          }),
          IconsResolver(),
          ComponentsResolver()
        ],
        types: [{
          from: "@uxuip/element-plus-query",
          names: [
            "QueryProvide",
            "QueryForm",
            "QueryTable",
            "QueryPagination"
          ]
        }],
        include: [/\.vue$/, /\.vue\?vue/, /\.tsx$/]
      }),
      // https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n
      VueI18n({
        runtimeOnly: true,
        compositionOnly: true,
        fullInstall: true,
        defaultSFCLang: "yml",
        include: [path.resolve(__vite_injected_original_dirname, "locales/**")]
      }),
      // https://github.com/antfu/unocss
      // see unocss.config.ts for config
      Unocss(),
      // https://github.com/antfu/unplugin-icons
      Icons({
        autoInstall: true,
        compiler: "vue3"
      }),
      Eslint()
    ],
    // https://github.com/vitest-dev/vitest
    test: {
      environment: "jsdom"
    }
  });
};
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJGOlxcXFx3b3JrXFxcXGNhci1yZW50YWwtbWFuYWdlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJGOlxcXFx3b3JrXFxcXGNhci1yZW50YWwtbWFuYWdlXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9GOi93b3JrL2Nhci1yZW50YWwtbWFuYWdlL3ZpdGUuY29uZmlnLnRzXCI7Ly8vIDxyZWZlcmVuY2UgdHlwZXM9XCJ2aXRlc3RcIiAvPlxyXG5cclxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IFZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXHJcbmltcG9ydCBQYWdlcyBmcm9tICd2aXRlLXBsdWdpbi1wYWdlcydcclxuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSdcclxuaW1wb3J0IEF1dG9JbXBvcnQgZnJvbSAndW5wbHVnaW4tYXV0by1pbXBvcnQvdml0ZSdcclxuaW1wb3J0IFVub2NzcyBmcm9tICd1bm9jc3Mvdml0ZSdcclxuaW1wb3J0IExheW91dHMgZnJvbSAndml0ZS1wbHVnaW4tdnVlLWxheW91dHMnXHJcbmltcG9ydCBWdWVKc3ggZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlLWpzeCdcclxuaW1wb3J0IEVzbGludCBmcm9tICd2aXRlLXBsdWdpbi1lc2xpbnQnXHJcbmltcG9ydCBWdWVJMThuIGZyb20gJ0BpbnRsaWZ5L3VucGx1Z2luLXZ1ZS1pMThuL3ZpdGUnXHJcbmltcG9ydCBJY29ucyBmcm9tICd1bnBsdWdpbi1pY29ucy92aXRlJ1xyXG5pbXBvcnQgSWNvbnNSZXNvbHZlciBmcm9tICd1bnBsdWdpbi1pY29ucy9yZXNvbHZlcidcclxuaW1wb3J0IHsgRWxlbWVudFBsdXNSZXNvbHZlciB9IGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3Jlc29sdmVycydcclxuXHJcbmNvbnN0IENvbXBvbmVudHNJbXBvcnRzID0ge1xyXG4gICdAZm9ybWlseS9lbGVtZW50LXBsdXMnOiBbXHJcbiAgICAnRm9ybScsXHJcbiAgICAnRm9ybUxheW91dCcsXHJcbiAgICAnRm9ybUJ1dHRvbkdyb3VwJyxcclxuICAgICdGb3JtSXRlbScsXHJcbiAgICAnSW5wdXQnLFxyXG4gICAgJ0lucHV0TnVtYmVyJyxcclxuICAgICdQYXNzd29yZCcsXHJcbiAgICAnU3VibWl0JyxcclxuICAgICdTd2l0Y2gnLFxyXG4gICAgJ0FycmF5VGFibGUnLFxyXG4gICAgJ1NwYWNlJyxcclxuICAgICdQcmV2aWV3VGV4dCcsXHJcbiAgXSxcclxuICAnQGZvcm1pbHkvdnVlJzogW1xyXG4gICAgJ0Zvcm1Qcm92aWRlcicsXHJcbiAgICAnRmllbGQnLFxyXG4gICAgJ0FycmF5RmllbGQnLFxyXG4gICAgJ1ZvaWRGaWVsZCcsXHJcbiAgXSxcclxufVxyXG5cclxuZnVuY3Rpb24gQ29tcG9uZW50c1Jlc29sdmVyKCkge1xyXG4gIHJldHVybiAobmFtZTogc3RyaW5nKSA9PiB7XHJcbiAgICBmb3IgKGNvbnN0IFtmcm9tLCBpbXBvcnRzXSBvZiBPYmplY3QuZW50cmllcyhDb21wb25lbnRzSW1wb3J0cykpIHtcclxuICAgICAgaWYgKGltcG9ydHMuaW5jbHVkZXMobmFtZSkpXHJcbiAgICAgICAgcmV0dXJuIHsgbmFtZSwgZnJvbSB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCAobW9kZTogc3RyaW5nKSA9PiB7XHJcbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpKVxyXG5cclxuICByZXR1cm4gZGVmaW5lQ29uZmlnKHtcclxuICAgIHNlcnZlcjoge1xyXG4gICAgICBwb3J0OiA0NDQ0LFxyXG4gICAgICBob3N0OiB0cnVlLFxyXG4gICAgICBwcm94eToge1xyXG4gICAgICAgICcvYXBpJzoge1xyXG4gICAgICAgICAgdGFyZ2V0OiBlbnYuVklURV9BUFBfQVBJLFxyXG4gICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgICAgcmV3cml0ZTogcGF0aCA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGkvLCAnJyksXHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICByZXNvbHZlOiB7XHJcbiAgICAgIGFsaWFzOiB7XHJcbiAgICAgICAgJ0AvJzogYCR7cGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYycpfS9gLFxyXG4gICAgICAgICd+Lyc6IGAke3BhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMnKX0vYCxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBwbHVnaW5zOiBbXHJcbiAgICAgIFZ1ZSh7XHJcbiAgICAgICAgcmVhY3Rpdml0eVRyYW5zZm9ybTogdHJ1ZSxcclxuICAgICAgfSksXHJcbiAgICAgIFZ1ZUpzeCgpLFxyXG4gICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vaGFubm9lcnUvdml0ZS1wbHVnaW4tcGFnZXNcclxuICAgICAgUGFnZXMoe1xyXG4gICAgICAgIGV4Y2x1ZGU6IFsnKiovY29tcG9uZW50cy8qLionXSxcclxuICAgICAgICByb3V0ZUJsb2NrTGFuZzogJ3lhbWwnLFxyXG4gICAgICB9KSxcclxuICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL0pvaG5DYW1waW9uSnIvdml0ZS1wbHVnaW4tdnVlLWxheW91dHNcclxuICAgICAgTGF5b3V0cygpLFxyXG4gICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYW50ZnUvdW5wbHVnaW4tYXV0by1pbXBvcnRcclxuICAgICAgQXV0b0ltcG9ydCh7XHJcbiAgICAgICAgaW1wb3J0czogW1xyXG4gICAgICAgICAgJ3Z1ZScsXHJcbiAgICAgICAgICAndnVlLXJvdXRlcicsXHJcbiAgICAgICAgICAndnVlLWkxOG4nLFxyXG4gICAgICAgICAgJ0B2dWV1c2UvY29yZScsXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgICdAZm9ybWlseS9jb3JlJzogW1xyXG4gICAgICAgICAgICAgICdjcmVhdGVGb3JtJyxcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgJ0B2dWV1c2UvaW50ZWdyYXRpb25zL3VzZUF4aW9zJzogWyd1c2VBeGlvcyddLFxyXG4gICAgICAgICAgICAnYXhpb3MnOiBbXHJcbiAgICAgICAgICAgICAgWydkZWZhdWx0JywgJ2F4aW9zJ10sXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgQ29tcG9uZW50c0ltcG9ydHMsXHJcbiAgICAgICAgXSxcclxuICAgICAgICByZXNvbHZlcnM6IFtcclxuICAgICAgICAgIEVsZW1lbnRQbHVzUmVzb2x2ZXIoe1xyXG4gICAgICAgICAgICBpbXBvcnRTdHlsZTogZmFsc2UsXHJcbiAgICAgICAgICB9KSxcclxuICAgICAgICBdLFxyXG4gICAgICAgIGR0czogdHJ1ZSxcclxuICAgICAgICBkaXJzOiBbXHJcbiAgICAgICAgICAnLi9zcmMvY29tcG9zYWJsZXMnLFxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgdnVlVGVtcGxhdGU6IHRydWUsXHJcbiAgICAgIH0pLFxyXG4gICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYW50ZnUvdml0ZS1wbHVnaW4tY29tcG9uZW50c1xyXG4gICAgICBDb21wb25lbnRzKHtcclxuICAgICAgICBkdHM6IHRydWUsXHJcbiAgICAgICAgcmVzb2x2ZXJzOiBbXHJcbiAgICAgICAgICBFbGVtZW50UGx1c1Jlc29sdmVyKHtcclxuICAgICAgICAgICAgaW1wb3J0U3R5bGU6IGZhbHNlLFxyXG4gICAgICAgICAgfSksXHJcbiAgICAgICAgICBJY29uc1Jlc29sdmVyKCksXHJcbiAgICAgICAgICBDb21wb25lbnRzUmVzb2x2ZXIoKSxcclxuICAgICAgICBdLFxyXG4gICAgICAgIHR5cGVzOiBbe1xyXG4gICAgICAgICAgZnJvbTogJ0B1eHVpcC9lbGVtZW50LXBsdXMtcXVlcnknLFxyXG4gICAgICAgICAgbmFtZXM6IFtcclxuICAgICAgICAgICAgJ1F1ZXJ5UHJvdmlkZScsXHJcbiAgICAgICAgICAgICdRdWVyeUZvcm0nLFxyXG4gICAgICAgICAgICAnUXVlcnlUYWJsZScsXHJcbiAgICAgICAgICAgICdRdWVyeVBhZ2luYXRpb24nLFxyXG4gICAgICAgICAgXSxcclxuICAgICAgICB9XSxcclxuICAgICAgICBpbmNsdWRlOiBbL1xcLnZ1ZSQvLCAvXFwudnVlXFw/dnVlLywgL1xcLnRzeCQvXSxcclxuICAgICAgfSksXHJcbiAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9pbnRsaWZ5L2J1bmRsZS10b29scy90cmVlL21haW4vcGFja2FnZXMvdW5wbHVnaW4tdnVlLWkxOG5cclxuICAgICAgVnVlSTE4bih7XHJcbiAgICAgICAgcnVudGltZU9ubHk6IHRydWUsXHJcbiAgICAgICAgY29tcG9zaXRpb25Pbmx5OiB0cnVlLFxyXG4gICAgICAgIGZ1bGxJbnN0YWxsOiB0cnVlLFxyXG4gICAgICAgIGRlZmF1bHRTRkNMYW5nOiAneW1sJyxcclxuICAgICAgICBpbmNsdWRlOiBbcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ2xvY2FsZXMvKionKV0sXHJcbiAgICAgIH0pLFxyXG4gICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYW50ZnUvdW5vY3NzXHJcbiAgICAgIC8vIHNlZSB1bm9jc3MuY29uZmlnLnRzIGZvciBjb25maWdcclxuICAgICAgVW5vY3NzKCksXHJcbiAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hbnRmdS91bnBsdWdpbi1pY29uc1xyXG4gICAgICBJY29ucyh7XHJcbiAgICAgICAgYXV0b0luc3RhbGw6IHRydWUsXHJcbiAgICAgICAgY29tcGlsZXI6ICd2dWUzJyxcclxuICAgICAgfSksXHJcbiAgICAgIEVzbGludCgpLFxyXG4gICAgXSxcclxuXHJcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vdml0ZXN0LWRldi92aXRlc3RcclxuICAgIHRlc3Q6IHtcclxuICAgICAgZW52aXJvbm1lbnQ6ICdqc2RvbScsXHJcbiAgICB9LFxyXG4gIH0pXHJcbn1cclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUVBLE9BQU8sVUFBVTtBQUNqQixTQUFTLGNBQWMsZUFBZTtBQUN0QyxPQUFPLFNBQVM7QUFDaEIsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sWUFBWTtBQUNuQixPQUFPLGFBQWE7QUFDcEIsT0FBTyxZQUFZO0FBQ25CLE9BQU8sWUFBWTtBQUNuQixPQUFPLGFBQWE7QUFDcEIsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sbUJBQW1CO0FBQzFCLFNBQVMsMkJBQTJCO0FBZnBDLElBQU0sbUNBQW1DO0FBaUJ6QyxJQUFNLG9CQUFvQjtBQUFBLEVBQ3hCLHlCQUF5QjtBQUFBLElBQ3ZCO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxFQUNGO0FBQUEsRUFDQSxnQkFBZ0I7QUFBQSxJQUNkO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsRUFDRjtBQUNGO0FBRUEsU0FBUyxxQkFBcUI7QUFDNUIsU0FBTyxDQUFDLFNBQWlCO0FBQ3ZCLGVBQVcsQ0FBQyxNQUFNLE9BQU8sS0FBSyxPQUFPLFFBQVEsaUJBQWlCLEdBQUc7QUFDL0QsVUFBSSxRQUFRLFNBQVMsSUFBSTtBQUN2QixlQUFPLEVBQUUsTUFBTSxLQUFLO0FBQUEsSUFDeEI7QUFBQSxFQUNGO0FBQ0Y7QUFF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
