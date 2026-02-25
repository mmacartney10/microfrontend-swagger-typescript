# Microfrontend API Server

This is the API server that provides data services for the microfrontend architecture demonstration.

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. The server will be available at:

- API: http://localhost:4000
- Swagger Documentation: http://localhost:4000/api-docs
- Health Check: http://localhost:4000/health

## Development

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the TypeScript code
- `npm start` - Start production server
- `npm run start:production` - Build and start production server

## API Documentation

The API documentation is automatically generated using Swagger/OpenAPI and is available at `/api-docs` when the server is running.
