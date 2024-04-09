import { Global, Module } from '@nestjs/common';

import { AwsS3Service } from './awsS3.service';

@Global()
@Module({
  imports: [],
  providers: [AwsS3Service],
  controllers: [],
  exports: [AwsS3Service],
})
export class AwsS3Module {}
