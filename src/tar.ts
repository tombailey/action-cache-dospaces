import tar from "tar";

export function createTarFile(
  inputFilePaths: string[],
  filePath: string,
  gzip = true,
) {
  return tar.create(
    {
      gzip,
      file: filePath,
      preservePaths: true,
    },
    inputFilePaths,
  );
}

export async function extractTarFile(filePath: string, outputPath: string) {
  return tar.extract({
    cwd: outputPath,
    file: filePath,
    preservePaths: true,
  });
}
