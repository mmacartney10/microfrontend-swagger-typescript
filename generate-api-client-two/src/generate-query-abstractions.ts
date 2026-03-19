import "dotenv/config";
import * as path from "node:path";
import * as fs from "node:fs";
import { SERVICES_METADATA, ServiceConfig } from "../output/services-metadata";
import { Eta } from "eta";

const outputDir =
  process.env.OUTPUT_DIR || path.resolve(process.cwd(), "./output");
const templatesDir = path.resolve(__dirname, "./templates");
const queryAbstractionsDir = path.resolve(outputDir, "./query-abstractions");

const eta = new Eta();

eta.configure({
  views: templatesDir,
  cache: false,
});

function generateQueryAbstractionsIndex(configs: ServiceConfig[]): string {
  let content = "// Auto-generated React Query options\n\n";

  for (const service of configs) {
    const fileName = service.name.toLowerCase();
    content += `// ${service.name} query and mutation options\n`;
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

async function generateQueryAbstractions() {
  if (!fs.existsSync(queryAbstractionsDir)) {
    fs.mkdirSync(queryAbstractionsDir, { recursive: true });
  }

  for (const service of SERVICES_METADATA) {
    const importTypes = getImportTypes(service.routes);
    const queryAbstractionContent = eta.render("query-abstractions.eta", {
      ...service,
      importTypes,
    });
    const fileName = `${service.name.toLowerCase()}.ts`;
    fs.writeFileSync(
      path.resolve(queryAbstractionsDir, fileName),
      queryAbstractionContent,
    );
    console.log(`Generated ${fileName}`);
  }

  const queryAbstractionsIndexContent =
    generateQueryAbstractionsIndex(SERVICES_METADATA);
  fs.writeFileSync(
    path.resolve(queryAbstractionsDir, "index.ts"),
    queryAbstractionsIndexContent,
  );
  console.log("Generated query-abstractions/index.ts");
}

generateQueryAbstractions();
