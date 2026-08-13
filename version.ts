import fs from "node:fs";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import rl from "node:readline/promises";

type FileData = { name: string; path: string; content: string };
type StrVersionData = { name: string; version: string };
type VersionMap = { [key in string]: StrVersionData };
type SemanticVersion = { major: number; minor: number; patch: number };
type SemanticVersionKey = keyof SemanticVersion;
const sv_keys = new Set<SemanticVersionKey>(["major", "minor", "patch"]);

const versionRegex = /^(?<major>\d+)\.(?<minor>\d+)\.(?<patch>\d+)$/;

const FILES = ["package.json", "src-tauri/tauri.conf.json", "src-tauri/Cargo.toml"] as const;

const fileNames = FILES.map((file) => path.basename(file));

const getAllFileData = () =>
  Promise.all(
    FILES.map((file) => ({
      name: path.basename(file),
      path: file,
      content: fs.readFileSync(file, "utf8"),
    })),
  ) satisfies Promise<FileData[]>;

const getVersionStr = (data: FileData[]) => {
  const result: StrVersionData[] = [];
  for (const { name, content } of data) {
    if (path.extname(name) === ".json") {
      const version = JSON.parse(content).version;
      result.push({ name, version });
      continue;
    }
    content.split("\n").forEach((line) => {
      if (line.startsWith("version")) {
        const versionLine = line.split("=");
        if (versionLine.length !== 2) {
          throw new Error(`Invalid version line "${line}" in ${name}`);
        }
        result.push({ name, version: versionLine[1].trim().replace(/"/g, "") });
      }
    });
  }
  return result;
};

const updateFile = async (files: FileData[], newVersion: VersionMap) => {
  try {
    const writers = files.map(({ name, path: fpath, content }) => {
      const newV = newVersion[name];
      let newContent: string;
      if (path.extname(name) === ".json") {
        const jsonContent = JSON.parse(content);
        jsonContent.version = newV.version;
        newContent = `${JSON.stringify(jsonContent, null, 2)}\n`;
      } else {
        let inPackageTable = true; // adjust default based on file format
        newContent = content
          .split("\n")
          .map((line) => {
            const trimmed = line.trim();
            if (trimmed.startsWith("[")) {
              inPackageTable = trimmed === "[package]";
              return line;
            }
            if (inPackageTable && trimmed.startsWith("version")) {
              return `version = "${newV.version}"`;
            }
            return line;
          })
          .join("\n");
      }
      return writeFile(fpath, newContent, "utf8");
    });

    await Promise.all(writers);
  } catch (error) {
    console.error("Error writing files:", error);
    throw error; // don't swallow — caller thinks it succeeded otherwise
  }
};

const strToSemanticVersion = (strVersion: string): SemanticVersion => {
  const match = strVersion.match(versionRegex);
  if (!match) {
    throw new Error(`Invalid version string "${strVersion}"`);
  }
  return {
    major: Number(match.groups?.major),
    minor: Number(match.groups?.minor),
    patch: Number(match.groups?.patch),
  };
};

const semanticToStrVersion = (version: SemanticVersion) =>
  `${version.major}.${version.minor}.${version.patch}`;

const regexToSemanticVersion = (regex: RegExpMatchArray): SemanticVersion => {
  return {
    major: Number(regex.groups?.major),
    minor: Number(regex.groups?.minor),
    patch: Number(regex.groups?.patch),
  };
};

const bumpVersion = (
  version: SemanticVersion,
  type: keyof SemanticVersion,
  num?: number | undefined | null,
): SemanticVersion => {
  const value = num ?? version[type] + 1;
  switch (type) {
    case "major":
      return { major: value, minor: 0, patch: 0 };
    case "minor":
      return { ...version, minor: value, patch: 0 };
    case "patch":
      return { ...version, patch: value };
  }
};

const args = process.argv.slice(2);
const bin = path.basename(process.argv[1]);

function usage() {
  console.log(`Usage: ${bin} <major|minor|patch [n]|x.y.z>
 
Bump or set the "version" field in ${fileNames.join(", ")}. Specify one of:
 
  major        Increment major version, reset minor and patch to 0
  major n      Set major version to n, reset minor and patch to 0
  minor        Increment minor version, reset patch to 0
  minor n      Set minor version to n, reset patch to 0
  patch        Increment patch version
  patch n      Set patch version to n
  x.y.z        Set the version to this exact value
 
Examples:
  ${bin} major         1.2.3 -> 2.0.0
  ${bin} major 4       1.2.3 -> 4.0.0
  ${bin} 3.0.0         1.2.3 -> 3.0.0

Options:
  -h --help       Show this help message.
  -s --show       Show the current version.
  `);
  process.exit(1);
}

if (args.length < 1 || args.length > 2) {
  usage();
}
function isOption(opt: "help" | "show", input: string): boolean {
  return input === `-${opt[0]}` || input === `--${opt}`;
}

const input = args[0];
let explicitNumber = null;

if (args.length === 2) {
  if (!sv_keys.has(input as keyof SemanticVersion)) {
    console.error(
      `A number argument is only valid with major, minor, or patch (got "${input} ${args[1]}").`,
    );
    usage();
  }
  if (!/^\d+$/.test(args[1])) {
    console.error(`Invalid number "${args[1]}" — must be a non-negative integer.`);
    usage();
  }
  explicitNumber = Number(args[1]);
}

if (isOption("help", input)) usage();
else if (isOption("show", input)) {
  const allFiles = await getAllFileData();
  const versions = getVersionStr(allFiles);
  for (const version of versions) {
    console.log(`${version.name}:  ${version.version}`);
  }
  process.exit(0);
}

const allFiles = await getAllFileData();
const versions = getVersionStr(allFiles);

const xyzVersion = input.match(versionRegex);
if (!sv_keys.has(input as keyof SemanticVersion) && xyzVersion === null) {
  console.log(
    `Invalid version string "${input}" — must be one of ${[...sv_keys].join(", ")} or x.y.z.`,
  );
  console.log(`See this help message for more information:\n`);
  usage();
}

for (const { name, version } of versions) {
  let newVersion: SemanticVersion;
  if (xyzVersion) {
    newVersion = regexToSemanticVersion(xyzVersion);
  } else {
    newVersion = bumpVersion(
      strToSemanticVersion(version),
      input as keyof SemanticVersion,
      explicitNumber,
    );
  }
  const newStrVersion = semanticToStrVersion(newVersion);
  console.log(`${name}: ${version} -> ${newStrVersion}`);
}

const terInput = rl.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const update = (
  await terInput.question(`\nDo you want to update the version? ([y]es/[n]o): `)
).toLowerCase();

if (update === "y" || update === "yes") {
  const newVersions: VersionMap = {};
  for (const { name, version } of versions) {
    let newVersion: SemanticVersion;
    if (xyzVersion) {
      newVersion = regexToSemanticVersion(xyzVersion);
    } else {
      newVersion = bumpVersion(
        strToSemanticVersion(version),
        input as keyof SemanticVersion,
        explicitNumber,
      );
    }
    newVersions[name] = { name, version: semanticToStrVersion(newVersion) };
  }
  await updateFile(allFiles, newVersions);
  console.log("All files have been successfully written!");
  process.exit(0);
}
if (update !== "n" && update !== "no") {
  console.error(`Invalid option "${update}" — must be one of [y]es, [n]o.`);
}
console.log("No updates applied.");
process.exit(0);
