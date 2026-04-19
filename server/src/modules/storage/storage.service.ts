import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { extname, join } from 'path';
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'fs';
import type { StorageService } from './storage.interface';

@Injectable()
export class LocalStorageService implements StorageService {
  private readonly logger = new Logger('LocalStorageService');
  private readonly uploadDir: string;

  constructor(private config: ConfigService) {
    this.uploadDir = config.get<string>('app.uploadDir', './uploads');
    if (!existsSync(this.uploadDir)) {
      mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async upload(file: Express.Multer.File, path: string): Promise<string> {
    const ext = extname(file.originalname);
    const filename = `${path}/${randomUUID()}${ext}`;
    const fullPath = join(this.uploadDir, filename);

    const dir = join(this.uploadDir, path);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

    writeFileSync(fullPath, file.buffer);
    return `/uploads/${filename}`;
  }

  async delete(path: string): Promise<void> {
    const fullPath = join(this.uploadDir, path.replace('/uploads/', ''));
    if (existsSync(fullPath)) unlinkSync(fullPath);
  }

  async getSignedUrl(path: string): Promise<string> {
    return path;
  }
}

@Injectable()
export class S3StorageService implements StorageService {
  private readonly logger = new Logger('S3StorageService');

  constructor(private config: ConfigService) {}

  async upload(file: Express.Multer.File, path: string): Promise<string> {
    // @ts-expect-error @aws-sdk packages are optional dependencies
    const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3');

    const client = new S3Client({
      region: this.config.get('storage.s3Region'),
      credentials: {
        accessKeyId: this.config.get('storage.s3AccessKey')!,
        secretAccessKey: this.config.get('storage.s3SecretKey')!,
      },
      ...(this.config.get('storage.s3Endpoint')
        ? { endpoint: this.config.get('storage.s3Endpoint'), forcePathStyle: true }
        : {}),
    });

    const ext = extname(file.originalname);
    const key = `${path}/${randomUUID()}${ext}`;

    await client.send(
      new PutObjectCommand({
        Bucket: this.config.get('storage.s3Bucket'),
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    const cdnUrl = this.config.get<string>('storage.cdnUrl');
    return cdnUrl ? `${cdnUrl}/${key}` : key;
  }

  async delete(path: string): Promise<void> {
    // @ts-expect-error @aws-sdk packages are optional dependencies
    const { S3Client, DeleteObjectCommand } = await import('@aws-sdk/client-s3');

    const client = new S3Client({
      region: this.config.get('storage.s3Region'),
      credentials: {
        accessKeyId: this.config.get('storage.s3AccessKey')!,
        secretAccessKey: this.config.get('storage.s3SecretKey')!,
      },
    });

    await client.send(
      new DeleteObjectCommand({
        Bucket: this.config.get('storage.s3Bucket'),
        Key: path,
      }),
    );
  }

  async getSignedUrl(path: string, expiresIn = 3600): Promise<string> {
    // @ts-expect-error @aws-sdk packages are optional dependencies
    const { S3Client, GetObjectCommand } = await import('@aws-sdk/client-s3');
    // @ts-expect-error @aws-sdk packages are optional dependencies
    const { getSignedUrl } = await import('@aws-sdk/s3-request-presigner');

    const client = new S3Client({
      region: this.config.get('storage.s3Region'),
      credentials: {
        accessKeyId: this.config.get('storage.s3AccessKey')!,
        secretAccessKey: this.config.get('storage.s3SecretKey')!,
      },
    });

    return getSignedUrl(
      client,
      new GetObjectCommand({ Bucket: this.config.get('storage.s3Bucket'), Key: path }),
      { expiresIn },
    );
  }
}
