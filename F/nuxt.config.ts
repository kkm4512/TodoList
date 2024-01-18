export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      baseURL: 'http://localhost:3001'
    }
  },
  css: [
    '~/assets/css/main.css',
    '~/assets/css/todo-styles.css',
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
})