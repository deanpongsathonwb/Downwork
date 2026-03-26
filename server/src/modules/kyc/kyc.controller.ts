import { Controller, Get, Post, Param, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../../common/config/multer.config';
import { KycService } from './kyc.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('kyc')
export class KycController {
  constructor(private kycService: KycService) {}

  @Get('status')
  getStatus(@CurrentUser('id') userId: string) {
    return this.kycService.getStatus(userId);
  }

  @Post('submit')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'document', maxCount: 1 },
    { name: 'selfie', maxCount: 1 },
  ], multerConfig))
  submit(
    @CurrentUser('id') userId: string,
    @UploadedFiles() files: { document?: { filename: string }[]; selfie?: { filename: string }[] },
  ) {
    const docUrl = files.document?.[0] ? `/uploads/${files.document[0].filename}` : '';
    const selfieUrl = files.selfie?.[0] ? `/uploads/${files.selfie[0].filename}` : undefined;
    return this.kycService.submit(userId, 'national_id', docUrl, selfieUrl);
  }

  @Get('documents/:id')
  getDocument(@Param('id') id: string) {
    return this.kycService.getDocument(id);
  }
}
