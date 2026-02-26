# @swagger-ts/api-client

Generated TypeScript API client from Swagger documentation.

## Usage

```bash
# Generate and build the API client
npm run build

# Publish locally via yalc for development
npm run publish:local
```

## Installation in microfrontends

```bash
# In each microfrontend
yalc add @swagger-ts/api-client

# Or after local publish
yalc update @swagger-ts/api-client
```

## Import in code

```typescript
import { Api, Task, Product, User } from "@swagger-ts/api-client";

const api = new Api({
  baseUrl: process.env.BASE_API_URL || "http://localhost:4000/api",
});
```
