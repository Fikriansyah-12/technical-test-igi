// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },

  runtimeConfig: {
    enviroment: "LOCAL",
    public: {
      baseUrl: process.env.NUXT_PUBLIC_API_BASE || '/api',
      appUrl: process.env.NUXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
      version: "0.0.0",
    },
  },
     routeRules: {
    '/': { redirect: '/auth/login' }, 
  },

  app: {
    head: {
      meta: [
        { "http-equiv": "X-UA-Compatible", content: "IE=edge" },
        { name: "viewport", content: "width=device-width, initial-scale=1.0, shrink-to-fit=no" },
      ],
      htmlAttrs: { lang: "en" },
      charset: "utf-8",
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },

  // Pakai format pasangan [module, options] TANPA nested array bercampur
  modules: [
    ['@pinia/nuxt', {
      autoImports: [
        'defineStore',
        ['defineStore', 'definePiniaStore'],
      ],
    }],
    '@nuxt/eslint','@nuxt/image'
  ],

  css: ['~/assets/css/main.css'],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  build: {
    transpile: ['gsap'],
  },

  compatibilityDate: "2025-10-25",
})
