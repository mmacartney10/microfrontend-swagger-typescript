import "dotenv/config";
import * as path from "node:path";
import * as process from "node:process";
import { generateApi } from "swagger-typescript-api";

async function generateTypeScript(outputDir: string): Promise<void> {
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
    output: path.resolve(process.cwd(), outputDir),
    silent: true,
    extraTemplates: [
      {
        name: "services-metadata",
        path: path.resolve(
          process.cwd(),
          "./src/utils/templates/services-metadata.eta",
        ),
      },
    ],
    input: path.resolve(outputDir, "./swagger.json"),
  });
}

export { generateTypeScript };
