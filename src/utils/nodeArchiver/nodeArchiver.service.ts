import { Injectable, Logger } from '@nestjs/common';
import { createReadStream, createWriteStream } from 'fs';
import * as archiver from 'archiver';

import { UtilsService } from '../utils.service';

@Injectable()
export class NodeArchiverService {
  private readonly logger = new Logger(NodeArchiverService.name);

  constructor(private readonly utilsService: UtilsService) {}

  archive = async (
    files: Array<string>,
    archiveFilePath: string,
    deleteFiles = true,
  ) => {
    const response = await new Promise((resolve, reject) => {
      try {
        const output = createWriteStream(archiveFilePath);
        const archive = archiver('zip', {
          zlib: { level: 1 },
        });
        archive.pipe(output);
        for (let i = 0; i < files.length; ++i) {
          archive.append(createReadStream(files[i]), { name: files[i] });
        }
        archive.finalize();

        output.on('finish', () => {
          this.logger.log(`Write stream finished`);
        });
        output.on('close', () => {
          this.logger.log(`Write stream closed`);
          this.logger.log(`${archive.pointer()} total bytes`);

          if (deleteFiles) {
            for (const file of files) {
              // delete files from file path
              this.utilsService.deleteFile(file);
            }
          }
          resolve(archiveFilePath);
        });
        output.on('error', (e) => {
          throw e;
        });
      } catch (e) {
        this.logger.error(e.message, e.stack);
        const logObject = {
          files,
          archiveFilePath,
          deleteFiles,
        };
        this.logger.error(JSON.stringify(logObject));
        reject(e);
      }
    });
    return response;
  };
}
