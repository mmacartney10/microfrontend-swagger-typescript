import "dotenv/config";
import * as path from "node:path";
import * as fs from "node:fs";
import * as os from "node:os";
// import { SERVICES_METADATA, ServiceConfig } from "../output/services-metadata";
import { Eta } from "eta";
import { build } from "esbuild";

async function loadServicesMetadata(filePath: string) {
  const tempDir = path.join(os.tmpdir(), "ts-loader");
  const tempFile = path.join(tempDir, "temp.mjs"); // Use .mjs for ES modules

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  await build({
    entryPoints: [filePath],
    outfile: tempFile,
    format: "esm", // Use ESM format instead of CJS
    platform: "node",
    bundle: false,
  });

  // Use dynamic import instead of require
  const module = await import(`file://${tempFile}`);
  return module;
}

const outputDir =
  process.env.OUTPUT_DIR || path.resolve(process.cwd(), "./output");
// const templatesDir = path.resolve(process.cwd(), "./templates");

const templatesDir = path.resolve(process.cwd(), "./src/utils/templates");
const queryAbstractionsDir = path.resolve(outputDir, "./query-abstractions");

const eta = new Eta();

eta.configure({
  views: templatesDir,
  cache: false,
});

function generateQueryAbstractionsIndex(configs: any[]): string {
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

async function generateQueryAbstractionsTwo(
  SERVICES_METADATA: any[],
): Promise<void> {
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

async function generateQueryAbstractions(outputDir: string): Promise<void> {
  try {
    const servicesMetadataPath = path.resolve(
      outputDir,
      "./services-metadata.ts",
    );

    const module = await loadServicesMetadata(servicesMetadataPath);
    const SERVICES_METADATA = module.SERVICES_METADATA;

    console.log("SERVICES_METADATA type:", typeof SERVICES_METADATA);
    console.log(
      "SERVICES_METADATA is array:",
      Array.isArray(SERVICES_METADATA),
    );
    console.log("SERVICES_METADATA length:", SERVICES_METADATA?.length);

    if (!Array.isArray(SERVICES_METADATA)) {
      throw new Error(
        `SERVICES_METADATA is not an array. Got: ${typeof SERVICES_METADATA}`,
      );
    }

    await generateQueryAbstractionsTwo(SERVICES_METADATA);
  } catch (error) {
    console.error("Failed to generate query abstractions:", error);
    throw error;
  }
}

export { generateQueryAbstractions };
