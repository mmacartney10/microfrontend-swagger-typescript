import "dotenv/config";
import * as path from "node:path";
import * as process from "node:process";
import * as fs from "node:fs";
import { generateApi } from "swagger-typescript-api";

async function generateTypeScript() {
  const outputDir = path.resolve(process.cwd(), "./output");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

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
    output: outputDir,
    silent: true,
    templates: path.resolve(process.cwd(), "./templates"),
    extraTemplates: [
      {
        name: "services-metadata",
        path: "./src/templates/services-metadata.eta",
      },
    ],
    url: process.env.SWAGGER_DOCS_URL as string,
  });
}

generateTypeScript().catch(console.error);
