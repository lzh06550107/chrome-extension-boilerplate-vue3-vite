import { createReadStream, createWriteStream, existsSync, mkdirSync } from 'node:fs';
import { posix, resolve } from 'node:path';
import glob from 'fast-glob';
import { AsyncZipDeflate, Zip } from 'fflate';

// 这段代码是一个用于打包文件夹内容为 ZIP 文件的工具

// Converts bytes to megabytes
function toMB(bytes: number): number {
  return bytes / 1024 / 1024;
}

// Creates the build directory if it doesn't exist
// 如果目标的 buildDirectory 不存在，则会递归创建
function ensureBuildDirectoryExists(buildDirectory: string): void {
  if (!existsSync(buildDirectory)) {
    mkdirSync(buildDirectory, { recursive: true });
  }
}

// Logs the package size and duration
function logPackageSize(size: number, startTime: number): void {
  console.log(`Zip Package size: ${toMB(size).toFixed(2)} MB in ${Date.now() - startTime}ms`);
}

// Handles file streaming and zipping
function streamFileToZip(
  absPath: string,
  relPath: string,
  zip: Zip,
  onAbort: () => void,
  onError: (error: Error) => void,
): void {
  const data = new AsyncZipDeflate(relPath, { level: 9 });
  zip.add(data);

  createReadStream(absPath)
    .on('data', (chunk: Buffer) => data.push(chunk, false)) // 写入数据块
    .on('end', () => data.push(new Uint8Array(0), true)) // 结束信号
    .on('error', error => {
      onAbort();
      onError(error);
    });
}

// Zips the bundle
/**
 * zipBundle 函数
 *
 * @param distDirectory 源文件夹的路径，ZIP 包的内容来源于此
 * @param buildDirectory 目标文件夹路径，用于存放生成的 ZIP 文件
 * @param archiveName 生成的 ZIP 文件名
 * @param withMaps 可选
 * true: 包含 .js.map 和 .css.map 文件。
 * false (默认): 排除这些文件。
 */
export const zipBundle = async (
  {
    distDirectory,
    buildDirectory,
    archiveName,
  }: {
    distDirectory: string;
    buildDirectory: string;
    archiveName: string;
  },
  withMaps = false,
): Promise<void> => {
  ensureBuildDirectoryExists(buildDirectory);

  const zipFilePath = resolve(buildDirectory, archiveName);
  const output = createWriteStream(zipFilePath);

  const fileList = await glob(
    [
      '**/*', // Pick all nested files
      ...(!withMaps ? ['!**/(*.js.map|*.css.map)'] : []), // Exclude source maps conditionally
    ],
    {
      cwd: distDirectory, // 搜索的根目录
      onlyFiles: true, // 只匹配文件，不包含文件夹
    },
  );

  return new Promise<void>((pResolve, pReject) => {
    let aborted = false;
    let totalSize = 0;
    const timer = Date.now();
    // 在 Zip 的回调函数中处理压缩完成和错误
    const zip = new Zip((err, data, final) => {
      if (err) {
        pReject(err); // 报错
      } else {
        totalSize += data.length; // 更新总大小
        output.write(data); // 写入 ZIP 文件
        if (final) {
          // 完成压缩
          logPackageSize(totalSize, timer); // 打印日志
          output.end();
          pResolve();
        }
      }
    });

    // Handle file read streams
    for (const file of fileList) {
      if (aborted) return;

      const absPath = resolve(distDirectory, file);
      const absPosixPath = posix.resolve(distDirectory, file);
      const relPosixPath = posix.relative(distDirectory, absPosixPath);

      console.log(`Adding file: ${relPosixPath}`);
      streamFileToZip(
        absPath,
        relPosixPath,
        zip,
        () => {
          aborted = true;
          zip.terminate();
        },
        error => pReject(`Error reading file ${absPath}: ${error.message}`),
      );
    }

    zip.end();
  });
};
