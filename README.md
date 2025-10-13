# @yassidev/nuxt-directus

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

A Nuxt module for better integration with Directus CMS, featuring advanced i18n management, TypeScript composables, auto-generated types, and much more.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)

## ✨ Features

- 🔧 **Pre-configured Composables**: Easy access to Directus API (REST/GraphQL)
- 🌍 **i18n Integration**: Bidirectional synchronization with @nuxtjs/i18n
- 📝 **TypeScript Types**: Automatic generation of Directus types
- 🖼️ **@nuxt/image Integration**: Optimized support for Directus assets
- 🔄 **Transparent Proxy**: CORS issues bypass
- ⚡ **Simplified Configuration**: Environment variables and default configuration
- 🔥 **Advanced Development Mode**: Real-time translation synchronization

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

### Basic Configuration

Add the module to your Nuxt configuration:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@yassidev/nuxt-directus'],
  
  // Optional configuration
  directus: {
    url: 'https://your-instance.directus.app',
    accessToken: 'your-access-token',
  },
})
```

### Environment Variables

You can also use environment variables:

```bash
# .env
DIRECTUS_URL=https://your-instance.directus.app
DIRECTUS_ACCESS_TOKEN=your-access-token
```

### Complete Configuration

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@yassidev/nuxt-directus'],
  
  directus: {
    // URL of your Directus instance
    url: 'https://your-instance.directus.app',
    
    // Directus access token
    accessToken: 'your-access-token',
    
    // Composables configuration
    composables: {
      enabled: true,        // Enable composables
      mode: 'rest',        // 'rest' or 'graphql'
      client: true,        // Available on client-side
      server: true,        // Available on server-side
    },
    
    // i18n configuration
    i18n: {
      enabled: true,       // Enable i18n integration
      sync: true,         // Bidirectional synchronization
      prefix: 'app.',     // Prefix for translation keys
    },
    
    // TypeScript types generation
    types: {
      enabled: true,       // Generate types automatically
    },
    
    // Proxy configuration
    proxy: {
      enabled: true,       // Enable proxy
      path: '/api',       // Proxy path
      options: {},        // h3 ProxyOptions
    },
    
    // @nuxt/image integration
    image: {
      enabled: true,       // Enable image integration
      alias: 'directus',  // Alias for images
    },
  },
})
```

## 🚀 Usage

### Directus Composables

The module provides a pre-configured `useDirectus()` composable:

```vue
<script setup>
// REST mode (default)
const directus = useDirectus()

// Fetch data
const { data: articles } = await directus.request(readItems('articles'))

// Create a new item
await directus.request(createItem('articles', {
  title: 'My article',
  content: 'Article content'
}))
</script>
```

#### GraphQL Mode

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

// GraphQL query
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

### TypeScript Types

The module automatically generates TypeScript types from your Directus schema:

```typescript
// All collections are available in #directus/types
import type { Schema } from '#directus/types'

// Usage in your code - types are automatically inferred
const directus = useDirectus()
const articles = await directus.request(readItems('articles')) // Type is automatically inferred
```

### i18n Integration

#### Prerequisites

Install and configure `@nuxtjs/i18n`:

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
    defaultLocale: 'en'
  }
})
```

#### Automatic Synchronization

Translations are automatically synchronized between Directus and your Nuxt application:

```vue
<template>
  <div>
    <!-- Translations are loaded from Directus -->
    <h1>{{ $t('welcome.title') }}</h1>
    <p>{{ $t('welcome.description') }}</p>
  </div>
</template>
```

#### Translation Management with Prefix

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  directus: {
    i18n: {
      prefix: 'frontend.' // Only keys starting with 'frontend.' will be synchronized
    }
  }
})
```

#### Real-time Synchronization (Development)

In development mode, local translation file changes are automatically synchronized with Directus:

1. Modify a local translation file
2. Changes are automatically sent to Directus
3. Other developers see updates in real-time

### @nuxt/image Integration

The module automatically configures `@nuxt/image` with an alias for Directus assets:

```vue
<template>
  <div>
    <!-- Direct usage with the configured alias -->
    <NuxtImg 
      src="directus/your-asset-id" 
      width="400" 
      height="300" 
    />
    
    <!-- With Directus transformations -->
    <NuxtImg 
      src="directus/your-asset-id?fit=cover&width=800&height=600" 
      width="400" 
      height="300" 
    />
  </div>
</template>
```

### API Proxy

The proxy allows bypassing CORS issues in development:

```typescript
// Instead of https://your-directus.com/items/articles
// Use /api/items/articles

const { data } = await $fetch('/api/items/articles')
```

## 🛠️ Development

### Development Project Setup

```bash
# Clone the repository
git clone https://github.com/yassilah/nuxt-directus.git

# Install dependencies
pnpm install

# Configure environment
cp .env.example .env
# Edit .env with your Directus settings

# Start the playground
pnpm dev
```

### Available Scripts

```bash
# Development
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

## 📚 Advanced Examples

### Data Fetching with Relations

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

### File Upload

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

### User Authentication

```vue
<script setup>
const directus = useDirectus()

async function login(email: string, password: string) {
  try {
    const result = await directus.request(login(email, password))
    // Handle successful login
    return result
  } catch (error) {
    // Handle login error
    console.error('Login error:', error)
  }
}
</script>
```

## 🔧 Advanced Configuration

### Disabling Features

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  directus: {
    // Disable i18n
    i18n: false,
    
    // Disable types
    types: false,
    
    // Disable proxy
    proxy: false,
    
    // Disable composables
    composables: false,
    
    // Disable image integration
    image: false,
  }
})
```

### Custom Proxy Configuration

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  directus: {
    proxy: {
      enabled: true,
      path: '/directus-api',
      options: {
        headers: {
          'Custom-Header': 'value'
        },
        timeout: 30000
      }
    }
  }
})
```

## ⚠️ Requirements

- Nuxt 3.x
- Node.js 18+
- Directus 10+ instance

### Optional Modules

- `@nuxtjs/i18n`: For internationalization features
- `@nuxt/image`: For image optimization

## 🤝 Contributing

<details>
  <summary>Local development</summary>
  
  ```bash
  # Install dependencies
  pnpm install
  
  # Generate type stubs
  pnpm dev:prepare
  
  # Develop with the playground
  pnpm dev
  
  # Build the playground
  pnpm dev:build
  
  # Run ESLint
  pnpm lint
  
  # Run Vitest
  pnpm test
  pnpm test:watch
  
  # Release new version
  pnpm release
  ```

</details>

### Steps to Contribute

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the [MIT](LICENSE) License.

## 🙏 Acknowledgments

- The [Directus](https://directus.io) team for their fantastic headless CMS
- The [Nuxt](https://nuxt.com) team for the framework
- The open source community for feedback and contributions

## 📞 Support

- 🐛 [Report a bug](https://github.com/yassilah/nuxt-directus/issues)
- 💡 [Request a feature](https://github.com/yassilah/nuxt-directus/issues)
- 💬 [Discussions](https://github.com/yassilah/nuxt-directus/discussions)

---

Made with ❤️ by [Yasser Lahbibi](https://github.com/yassilah)

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@yassidev/nuxt-directus/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/@yassidev/nuxt-directus

[npm-downloads-src]: https://img.shields.io/npm/dm/@yassidev/nuxt-directus.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/@yassidev/nuxt-directus

[license-src]: https://img.shields.io/npm/l/@yassidev/nuxt-directus.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/@yassidev/nuxt-directus

[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com