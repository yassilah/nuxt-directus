# @yassidev/nuxt-directus

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

Un module Nuxt pour une meilleure intégration avec Directus CMS, offrant une gestion avancée de l'i18n, des composables TypeScript, des types générés automatiquement et bien plus encore.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)

## ✨ Fonctionnalités

- 🔧 **Composables pré-configurés** : Accès facile à l'API Directus (REST/GraphQL)
- 🌍 **Intégration i18n** : Synchronisation bidirectionnelle avec @nuxtjs/i18n
- 📝 **Types TypeScript** : Génération automatique des types Directus
- 🖼️ **Intégration @nuxt/image** : Support optimisé pour les assets Directus
- 🔄 **Proxy transparent** : Contournement des problèmes CORS
- ⚡ **Configuration simplifiée** : Variables d'environnement et configuration par défaut
- 🔥 **Mode développement avancé** : Synchronisation en temps réel des traductions

## 📦 Installation

```bash
# npm
npm install @yassidev/nuxt-directus

# yarn
yarn add @yassidev/nuxt-directus

# pnpm
pnpm install @yassidev/nuxt-directus
```

## ⚙️ Configuration

### Configuration de base

Ajoutez le module à votre configuration Nuxt :

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@yassidev/nuxt-directus'],
  
  // Configuration optionnelle
  directus: {
    url: 'https://votre-instance.directus.app',
    accessToken: 'votre-token-dacces',
  },
})
```

### Variables d'environnement

Vous pouvez également utiliser les variables d'environnement :

```bash
# .env
DIRECTUS_URL=https://votre-instance.directus.app
DIRECTUS_ACCESS_TOKEN=votre-token-dacces
```

### Configuration complète

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@yassidev/nuxt-directus'],
  
  directus: {
    // URL de votre instance Directus
    url: 'https://votre-instance.directus.app',
    
    // Token d'accès Directus
    accessToken: 'votre-token-dacces',
    
    // Configuration des composables
    composables: {
      enabled: true,        // Active les composables
      mode: 'rest',        // 'rest' ou 'graphql'
      client: true,        // Disponible côté client
      server: true,        // Disponible côté serveur
    },
    
    // Configuration i18n
    i18n: {
      enabled: true,       // Active l'intégration i18n
      sync: true,         // Synchronisation bidirectionnelle
      prefix: 'app.',     // Préfixe pour les clés de traduction
    },
    
    // Génération des types TypeScript
    types: {
      enabled: true,       // Génère les types automatiquement
    },
    
    // Configuration du proxy
    proxy: {
      enabled: true,       // Active le proxy
      path: '/api',       // Chemin du proxy
      options: {},        // Options h3 ProxyOptions
    },
    
    // Intégration avec @nuxt/image
    image: {
      enabled: true,       // Active l'intégration image
      alias: 'directus',  // Alias pour les images
    },
  },
})
```

## 🚀 Utilisation

### Composables Directus

Le module fournit un composable `useDirectus()` configuré automatiquement :

```vue
<script setup>
// Mode REST (par défaut)
const directus = useDirectus()

// Récupérer des données
const { data: articles } = await directus.request(readItems('articles'))

// Créer un nouvel élément
await directus.request(createItem('articles', {
  title: 'Mon article',
  content: 'Contenu de l\'article'
}))
</script>
```

#### Mode GraphQL

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  directus: {
    composables: {
      mode: 'graphql'
    }
  }
})
```

```vue
<script setup>
const directus = useDirectus()

// Requête GraphQL
const result = await directus.query(`
  query {
    articles {
      id
      title
      content
    }
  }
`)
</script>
```

### Types TypeScript

Le module génère automatiquement les types TypeScript de votre schéma Directus :

```typescript
// Toutes les collections sont disponibles dans #directus/types
import type { Schema } from '#directus/types'

// Utilisation dans votre code - les types sont automatiquement détectés
const directus = useDirectus()
const articles = await directus.request(readItems('articles')) // Le type est automatiquement inféré
```

### Intégration i18n

#### Configuration préalable

Installez et configurez `@nuxtjs/i18n` :

```bash
npm install @nuxtjs/i18n
```

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/i18n', '@yassidev/nuxt-directus'],
  
  i18n: {
    locales: [
      { code: 'fr', name: 'Français' },
      { code: 'en', name: 'English' }
    ],
    defaultLocale: 'fr'
  }
})
```

#### Synchronisation automatique

Les traductions sont automatiquement synchronisées entre Directus et votre application Nuxt :

```vue
<template>
  <div>
    <!-- Les traductions sont chargées depuis Directus -->
    <h1>{{ $t('welcome.title') }}</h1>
    <p>{{ $t('welcome.description') }}</p>
  </div>
</template>
```

#### Gestion des traductions avec préfixe

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  directus: {
    i18n: {
      prefix: 'frontend.' // Seules les clés commençant par 'frontend.' seront synchronisées
    }
  }
})
```

#### Synchronisation en temps réel (développement)

En mode développement, les modifications des fichiers de traduction sont automatiquement synchronisées avec Directus :

1. Modifiez un fichier de traduction local
2. Les changements sont automatiquement envoyés à Directus
3. Les autres développeurs voient les mises à jour en temps réel

### Intégration avec @nuxt/image

Le module configure automatiquement `@nuxt/image` avec un alias pour les assets Directus :

```vue
<template>
  <div>
    <!-- Utilisation directe avec l'alias configuré -->
    <NuxtImg 
      src="directus/votre-asset-id" 
      width="400" 
      height="300" 
    />
    
    <!-- Avec transformations Directus -->
    <NuxtImg 
      src="directus/votre-asset-id?fit=cover&width=800&height=600" 
      width="400" 
      height="300" 
    />
  </div>
</template>
```

### Proxy API

Le proxy permet d'éviter les problèmes CORS en développement :

```typescript
// Au lieu de https://votre-directus.com/items/articles
// Utilisez /api/items/articles

const { data } = await $fetch('/api/items/articles')
```

## 🛠️ Développement

### Configuration du projet de développement

```bash
# Cloner le repository
git clone https://github.com/yassilah/nuxt-directus.git

# Installer les dépendances
pnpm install

# Configurer l'environnement
cp .env.example .env
# Éditer .env avec vos paramètres Directus

# Lancer le playground
pnpm dev
```

### Scripts disponibles

```bash
# Développement
pnpm dev

# Build
pnpm build

# Tests
pnpm test
pnpm test:watch

# Linting
pnpm lint

# Release
pnpm release
```

## 📚 Exemples avancés

### Récupération de données avec relations

```vue
<script setup>
const directus = useDirectus()

const { data: articles } = await directus.request(readItems('articles', {
  fields: [
    'id',
    'title', 
    'content',
    'author.first_name',
    'author.last_name',
    'category.name'
  ],
  filter: {
    status: { _eq: 'published' }
  },
  sort: ['-date_created'],
  limit: 10
}))
</script>
```

### Upload de fichiers

```vue
<script setup>
const directus = useDirectus()

async function uploadFile(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  
  const result = await directus.request(uploadFiles(formData))
  return result
}
</script>
```

### Authentification utilisateur

```vue
<script setup>
const directus = useDirectus()

async function login(email: string, password: string) {
  try {
    const result = await directus.request(login(email, password))
    // Gérer la connexion réussie
    return result
  } catch (error) {
    // Gérer l'erreur de connexion
    console.error('Erreur de connexion:', error)
  }
}
</script>
```

## 🔧 Configuration avancée

### Désactiver des fonctionnalités

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  directus: {
    // Désactiver l'i18n
    i18n: false,
    
    // Désactiver les types
    types: false,
    
    // Désactiver le proxy
    proxy: false,
    
    // Désactiver les composables
    composables: false,
    
    // Désactiver l'intégration image
    image: false,
  }
})
```

### Configuration personnalisée du proxy

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  directus: {
    proxy: {
      enabled: true,
      path: '/directus-api',
      options: {
        headers: {
          'Custom-Header': 'valeur'
        },
        timeout: 30000
      }
    }
  }
})
```

## ⚠️ Prérequis

- Nuxt 3.x
- Node.js 18+
- Une instance Directus 10+

### Modules optionnels

- `@nuxtjs/i18n` : Pour les fonctionnalités d'internationalisation
- `@nuxt/image` : Pour l'optimisation des images

## 🤝 Contribution

<details>
  <summary>Développement local</summary>
  
  ```bash
  # Installer les dépendances
  pnpm install
  
  # Générer les type stubs
  pnpm dev:prepare
  
  # Développer avec le playground
  pnpm dev
  
  # Build le playground
  pnpm dev:build
  
  # Lancer ESLint
  pnpm lint
  
  # Lancer Vitest
  pnpm test
  pnpm test:watch
  
  # Release une nouvelle version
  pnpm release
  ```

</details>

### Étapes pour contribuer

1. Forkez le projet
2. Créez votre branche de fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Commitez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Poussez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence [MIT](LICENSE).

## 🙏 Remerciements

- L'équipe [Directus](https://directus.io) pour leur fantastique CMS headless
- L'équipe [Nuxt](https://nuxt.com) pour le framework
- La communauté open source pour les retours et contributions

## 📞 Support

- 🐛 [Signaler un bug](https://github.com/yassilah/nuxt-directus/issues)
- 💡 [Demander une fonctionnalité](https://github.com/yassilah/nuxt-directus/issues)
- 💬 [Discussions](https://github.com/yassilah/nuxt-directus/discussions)

---

Fait avec ❤️ par [Yasser Lahbibi](https://github.com/yassilah)

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@yassidev/nuxt-directus/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/@yassidev/nuxt-directus

[npm-downloads-src]: https://img.shields.io/npm/dm/@yassidev/nuxt-directus.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/@yassidev/nuxt-directus

[license-src]: https://img.shields.io/npm/l/@yassidev/nuxt-directus.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/@yassidev/nuxt-directus

[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com
