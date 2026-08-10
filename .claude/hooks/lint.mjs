import { ESLint } from "eslint";

let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => (raw += chunk));
process.stdin.on("end", async () => {
  let file;
  try {
    file = JSON.parse(raw.replace(/^﻿/, "")).tool_input?.file_path;
  } catch {
    process.exit(0);
  }

  if (!file || !/\.(ts|mjs|astro)$/.test(file)) process.exit(0);

  const eslint = new ESLint({ cwd: process.cwd() });
  const results = await eslint.lintFiles([file]);

  if (!results.some((result) => result.errorCount > 0)) process.exit(0);

  const formatter = await eslint.loadFormatter("stylish");
  process.stderr.write(await formatter.format(results));
  process.exit(2);
});
