# microfrontend-swagger-typescript

## Installation

1. **Clone the repository:**

   ```sh
   git clone <repo-url>
   cd microfrontend-swagger-typescript
   ```

2. **Install dependencies for all packages:**
   ```sh
   npm install
   cd api-server && npm install
   cd ../generate-api-client && npm install
   cd ../microfrontend && npm install
   cd ../microfrontend2 && npm install
   cd ../microfrontend3 && npm install
   cd ../web-root && npm install
   ```

## Running the Project

### 1. Start the API Server

```sh
cd api-server
npm run dev
```

### 2. Generate API Client & Hooks

```sh
cd generate-api-client
npm run generate
```

### 3. Start Microfrontends

In separate terminals, run:

```sh
cd microfrontend && npm start
```

```sh
cd microfrontend2 && npm start
```

```sh
cd microfrontend3 && npm start
```

### 4. Start the Web Root (Host)

```sh
cd web-root
npm start
```

## Notes

- Ensure the API server is running before using the microfrontends.
- Regenerate the API client after any API changes.
