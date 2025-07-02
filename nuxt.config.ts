// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  css: [
    'bulma/css/bulma.min.css',
    '~/assets/custom.css'
  ],
  devtools: { enabled: true },
  app: {
    head: {
      title: 'Булонька',
      titleTemplate: '%s | Булонька',
      meta: [
        { name: 'description', content: 'Булонька — современная пекарня в Нижнем Новгороде. Свежая выпечка, уютная атмосфера, заказы онлайн.' },
        { name: 'keywords', content: 'Булонька, булочная, пекарня, Нижний Новгород, выпечка, хлеб, круассаны, заказы, торт, десерты' },
        { property: 'og:title', content: 'Булонька — пекарня в Нижнем Новгороде' },
        { property: 'og:description', content: 'Свежая выпечка, уютная атмосфера, онлайн-заказы. Заходите в Булоньку!' },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'ru_RU' },
        { property: 'og:image', content: '/bakery/baguette.jpg' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Булонька — пекарня в Нижнем Новгороде' },
        { name: 'twitter:description', content: 'Свежая выпечка, уютная атмосфера, онлайн-заказы.' },
        { name: 'twitter:image', content: '/bakery/baguette.jpg' }
      ],
      script: [
        {
          id: 'ldjson',
          type: 'application/ld+json',
          innerHTML: `{
            "@context": "https://schema.org",
            "@type": "Bakery",
            "name": "Булонька",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Нижний Новгород",
              "streetAddress": "ул. Примерная, 1"
            },
            "image": "/bakery/baguette.jpg",
            "telephone": "+7 999 123-45-67",
            "url": "https://ВАШ_ДОМЕН"
          }`
        }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  }
})
