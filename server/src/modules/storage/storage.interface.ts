export interface StorageService {
  upload(file: Express.Multer.File, path: string): Promise<string>;
  delete(path: string): Promise<void>;
  getSignedUrl(path: string, expiresIn?: number): Promise<string>;
}

export const STORAGE_SERVICE = 'STORAGE_SERVICE';
