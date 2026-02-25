import "dotenv/config";
import * as path from "node:path";
import * as process from "node:process";
import { generateApi } from "swagger-typescript-api";

async function generateTypeScript() {
  await generateApi({
    addReadonly: false,
    extractEnums: false,
    extractRequestBody: true,
    extractRequestParams: true,
    extractResponseBody: true,
    generateClient: true,
    generateRouteTypes: true,
    generateUnionEnums: false,
    httpClientType: "fetch",
    moduleNameFirstTag: true,
    output: path.resolve(process.cwd(), "./src"),
    silent: true,
    url: process.env.SWAGGER_DOCS_URL as string,
  });
}

generateTypeScript().catch(console.error);
