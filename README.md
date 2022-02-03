# Nuxt Directus

> Directus integration with Nuxt.

## Features

- 👌 Directus 9 SDK
- 👩‍⚕️ Authentication
- 🚦 Middlewares (auth + role)
- 💯 Nuxt 3 support

## Quick setup

> You need to have a Directus project up and running to use this module. To learn more about how to start a Directus project, follow this link: https://docs.directus.io/getting-started/quickstart/

1. Add `@module` dependency to your project

```bash
yarn add @module # or npm install  @module
```

2. Add `@module` to the modules section of `nuxt.config.ts`

```ts
import { defineNuxtConfig } from "nuxt3";

export default defineNuxtConfig({
  modules: ["@module"],
  directus: {
    // your options
  },
});
```

## Configuration

This module supports a number of options to let you enjoy the power of Directus with ease 🔥.

```ts
{
    api: string // This is the url of your Directus instance. Defaults to `http://localhost:8055`.,

    redirectAuthLogin: string // This is the url you would like the user to get redirected to when accessing a page that requires authentication. Defaults to `/login`.

    addMiddlewares: boolean // Whether you would like the middlewares included in this module to be added to your app.Defaults to `true`.

    addGlobalAuthCheck: boolean // Adds a middleware to check whether the user is authenticated on every route. Disabled if `addMiddlewares` is set to false. Defaults to `true`.

    addRolesMiddleware: string[] // Adds a list of role-based middleware to check whether the user has a specific role. Disabled if `addMiddlewares` is set to false. Defaults to ['administrator'].
}
```

## Usage

### Composables

This module adds some convenient (auto-imported) composables to make it easier to access your collections.

#### useItems

> See more [here](./src/composables/useItems.ts).

This is a convenience composable that lets you easily access a list of items from a collection.

```vue
<script lang="ts" setup>
const items = useItems("foo");

// OR
const collectionName = ref("bar");
const reactiveItems = useItems(collectionName);

// OR
const route = useRoute();
const reactiveItems = useItems(() => route.params.bar);
</script>

<template>
  <h1>Foo collection</h1>
  <div v-for="item in items" :key="item.id">
    {{ item.name }}
  </div>
</template>
```

If you want to have more controls over your list of items, you may set the `controls` option to `true`. Instead of returning a `ref`, the composable will return an object.

```vue
<script lang="ts" setup>
const { items, loading, fetch, collection, error } = useItems("foo", {
  controls: true,
});
</script>

<template>
  <h1>Foo collection</h1>

  <template v-if="error">
    <p>Oops! Looks like there was an error.</p>
    <pre>{{ error }}</pre>
  </template>

  <template v-else-if="loading">
    <p>Loading...</p>
  </template>

  <template v-else>
    <div v-for="item in items" :key="item.id">
      {{ item.name }}
    </div>
    <button @click="fetch">Refresh</button>
  </template>
</template>
```

You also have a few more options.

```vue
<script lang="ts" setup>
const items = useItems("foo", {
  controls: false, // Whether to return a simpel ref or an object. Defaults to `false`.
  refreshOnAuthChanged: true, // Whether you would like to autoamatically refresh the list whenever your user auth status changes. Defaults to `true`.
  watch: true, // Whether you would like to automatically refresh the list whenever your collection name changes. Defaults to `true`.
  fetch: true, // Whether you would like to fetch the list on initialization.
});
</script>
```

#### useItem

> See more [here](./src/composables/useItem.ts).

This is a convenience composable that lets you easily access a single item from a collection by its ID.

```vue
<script lang="ts" setup>
const item = useItem("foo", 1);

// OR
const collectionName = ref("bar");
const itemId = ref(1);
const reactiveItems = useItem(collectionName, itemId);

// OR
const route = useRoute();
const reactiveItems = useItem(
  () => route.params.bar,
  () => route.query.id
);
</script>

<template>
  <h1>Foo</h1>
  <pre>{{ item }}</pre>
</template>
```

All the options available with `useItems` are also available with `useItem`.

```vue
<script lang="ts" setup>
const item = useItem("foo", 1, {
  controls: false,
  refreshOnAuthChanged: true,
  watch: true,
  fetch: true,
});
</script>
```

#### useDirectus

> See more [here](./src/composables/useDirectus.ts).

This is the main DIrectus composable.

```vue
<script lang="ts" setup>
const directus = useDirectus(); // Access the Directus SDK.
</script>
```

#### useAuth

> See more [here](./src/composables/useAuth.ts).

This is the authentication composable.

```vue
<script lang="ts" setup>
const {
  user,
  authenticated,
  login,
  logout,
  loggingOut,
  loggingIn,
  refreshing,
  loading,
  refresh,
  check,
  role,
} = useAuth();
</script>

<template>
  <div v-if="user">
    <h1>Hi, {{ user.firstname }}! 👋</h1>
  </div>
</template>
```

#### useCollection

> See more [here](./src/composables/useCollection.ts).

This is a simple wrapper to access a collection instance from the Directus SDK.

```vue
<script lang="ts" setup>
const collection = useCollection("foo");

// OR
const collectionName = ref("bar");
const reactiveCollection = useCollection(collectionName);

// OR
const route = useRoute();
const reactiveCollection = useCollection(() => route.params.bar);
</script>
```

### Middlewares

> Please note that at the time of writing, client-side middlewares are available only if using Nuxt pages. See more [here](https://v3.nuxtjs.org/docs/directory-structure/pages).

#### globalAuthCheck

If you have not set the `addGlobalAuthCheck` option of the module to `false`, the module will automatically check if a user is logged in before each route. This will not prevent navigation but simply fill in the current user information in a globally accessible state (using `useAuth` composable).

#### auth

This is a simple middleware to verify that a user is logged in before accessing a given route.

```vue
<script lang="ts" setup>
definePageMeta({
  middleware: "auth",
});

const { user } = useAuth();
</script>

<template>
  // No need to add a `v-if` statement as a user has to be set to access this
  page.
  <h1>Hi, {{ user.firstname }}! 👋</h1>
</template>
```

#### auth:role

This is a middleware that will verify that a user is logged in and has a certain role before accessing a given route.

```vue
<script lang="ts" setup>
definePageMeta({
  middleware: "auth:administrator",
});

const { user } = useAuth();
</script>

<template>
  <h1>Hi, {{ user.firstname }}! You're an admin! 👋</h1>
</template>
```

You may add more role-based middlewares by setting the `addRolesMiddleware` option of the module.

```ts
// nuxt.config.ts
import { defineNuxtConfig } from "nuxt3";

export default defineNuxtConfig({
    ...,
    directus: {
        addRolesMiddleware: ['super-user', 'not-so-super-user']
    },
});
```

```vue
// route.vue
<script lang="ts" setup>
definePageMeta({
  middleware: "auth:super-user",
});

const { user } = useAuth();
</script>

<template>
  <h1>Hi, {{ user.firstname }}! You're a super user! 👋</h1>
</template>
```

## Licence

[MIT Licence](./LICENCE)
