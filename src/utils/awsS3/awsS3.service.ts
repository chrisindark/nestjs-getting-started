import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// import { SentryService } from 'src/interceptors/sentry/sentry.service';

const PRESIGNED_URL_EXPIRY = 6000;

@Injectable()
export class AwsS3Service {
  s3Client: S3Client;
  private readonly logger = new Logger(AwsS3Service.name);
  constructor(
    // private readonly sentryService: SentryService,
    private readonly configService: ConfigService,
  ) {
    this.createS3Client();
  }

  createS3Client = () => {
    const awsAccessKeyIdPrivate = this.configService.getOrThrow(
      'AWS_ACCESS_KEY_ID_PRIVATE',
    );
    const awsSecretAccessKeyPrivate = this.configService.getOrThrow(
      'AWS_SECRET_ACCESS_KEY_PRIVATE',
    );
    const awsRegion = this.configService.getOrThrow('AWS_DEFAULT_REGION');

    try {
      this.s3Client = new S3Client({
        region: awsRegion,
        credentials: {
          accessKeyId: awsAccessKeyIdPrivate,
          secretAccessKey: awsSecretAccessKeyPrivate,
        },
      });
    } catch (e) {
      this.logger.error(e.message, e.stack);

      throw e;
    }
  };

  generatePresignedUrl = async (
    key: string,
    companyId: number,
  ): Promise<string> => {
    const s3GetCommand = new GetObjectCommand({
      Key: `${key}`,
      Bucket: this.configService.getOrThrow('AWS_S3_BUCKET_NAME_PRIVATE'),
    });

    try {
      return await getSignedUrl(this.s3Client, s3GetCommand, {
        expiresIn: PRESIGNED_URL_EXPIRY,
      });
    } catch (e) {
      const logObject = {
        Key: `${key}`,
        Bucket: this.configService.getOrThrow('AWS_S3_BUCKET_NAME_PRIVATE'),
      };
      this.logger.error(e);
      this.logger.error(JSON.stringify(logObject));

      throw Error(e);
    }
  };

  getS3Object = async (key: string) => {
    const s3GetCommand = new GetObjectCommand({
      Key: key,
      Bucket: this.configService.getOrThrow('AWS_S3_BUCKET_NAME_PRIVATE'),
    });

    try {
      const response = await this.s3Client.send(s3GetCommand);
      return response;
    } catch (e) {
      this.logger.error(e.message, e.stack);

      throw Error(e);
    }
  };
}
