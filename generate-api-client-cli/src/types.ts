export interface CliAnswers {
  swaggerUrl: string;
  outputDir: string;
}

export interface DiffResult {
  added: string[];
  removed: string[];
  modified: string[];
  hasChanges: boolean;
}

export interface AuthConfig {
  headers?: Record<string, string>;
}
