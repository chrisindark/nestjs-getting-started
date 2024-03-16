import { Injectable, Logger } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
// import { extname } from 'path';
import { ConfigService } from '@nestjs/config';
import { Response } from 'teeny-request';

export const GCLOUD_STORAGE_REPORTS_FOLDER_NAME = 'voice-reports';
export const GCLOUD_STORAGE_BASE_URL = 'https://storage.googleapis.com';

@Injectable()
export class GCloudStorageService {
  private storageClient: Storage;
  private readonly projectId: string;
  private gcsBucket: string;

  private readonly logger = new Logger(GCloudStorageService.name);

  constructor(private readonly configService: ConfigService) {
    this.projectId = this.configService.get('GCLOUD_PROJECT_ID');
    this.connect();

    this.gcsBucket = this.configService.get(
      'GCLOUD_STORAGE_JUSTCALL_REPORTS_BUCKET_NAME',
    );
  }

  connect = async () => {
    try {
      this.storageClient = new Storage({
        projectId: this.projectId,
      });
    } catch (e) {
      this.logger.error(e.message, e.stack);
    }
  };

  uploadFile = async (localFilePath: any, cloudFilePath?: string) => {
    try {
      if (!cloudFilePath) {
        cloudFilePath = `${GCLOUD_STORAGE_REPORTS_FOLDER_NAME}/voice-tools_${new Date().getTime()}`;
      }
      // cloudFilePath = cloudFilePath.concat(extname(localFilePath));

      const [response, err] = await this.storageClient
        .bucket(this.gcsBucket)
        .upload(localFilePath, {
          destination: cloudFilePath,
          predefinedAcl: 'publicRead',
        });
      this.logger.log(`File uploaded successfully: ${response.publicUrl()}`);
      this.logger.error(err);
      return this.getFileUrl(cloudFilePath);
    } catch (e) {
      this.logger.error(e.message, e.stack);
      throw e;
    }
  };

  deleteFile = async (cloudFileName: string): Promise<[Response<any>]> => {
    try {
      const response = await this.storageClient
        .bucket(this.gcsBucket)
        .file(cloudFileName)
        .delete();
      return response;
    } catch (e) {
      this.logger.error(e.message, e.stack);
      throw e;
    }
  };

  getFileUrl = (cloudFilePath: string) => {
    return `${GCLOUD_STORAGE_BASE_URL}/${this.gcsBucket}/${cloudFilePath}`;
  };
}
