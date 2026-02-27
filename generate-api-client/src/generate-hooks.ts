import "dotenv/config";
import * as path from "node:path";
import * as fs from "node:fs";
import { SERVICES_METADATA, ServiceConfig } from "../output/services-metadata";
import { Eta } from "eta";

const outputDir = path.resolve(process.cwd(), "./output");
const templatesDir = path.resolve(__dirname, "./templates");
const hooksDir = path.resolve(outputDir, "./hooks");

const eta = new Eta();

eta.configure({
  views: templatesDir,
  cache: false,
});

function generateHooksIndex(configs: ServiceConfig[]): string {
  let content = "// Auto-generated React Query hooks\n\n";

  for (const service of configs) {
    const fileName = `use${service.name}`;
    content += `// ${service.name} hooks\n`;
    content += `export * from \"./${fileName}\";\n\n`;
  }

  return content;
}

function getImportTypes(routes: any[]): string[] {
  const types = new Set<string>();

  for (const route of routes) {
    if (route.requestBodyType) types.add(route.requestBodyType);
    if (route.requestParamsType) types.add(route.requestParamsType);
  }

  return Array.from(types).filter(Boolean) as string[];
}

async function generateHooks() {
  if (!fs.existsSync(hooksDir)) {
    fs.mkdirSync(hooksDir, { recursive: true });
  }

  for (const service of SERVICES_METADATA) {
    const importTypes = getImportTypes(service.routes);
    const hookContent = eta.render("hooks.eta", {
      ...service,
      importTypes,
    });
    const fileName = `use${service.name}.ts`;
    fs.writeFileSync(path.resolve(hooksDir, fileName), hookContent);
    console.log(`Generated ${fileName}`);
  }

  const hooksIndexContent = generateHooksIndex(SERVICES_METADATA);
  fs.writeFileSync(path.resolve(hooksDir, "index.ts"), hooksIndexContent);
  console.log("Generated hooks/index.ts");
}

generateHooks();
