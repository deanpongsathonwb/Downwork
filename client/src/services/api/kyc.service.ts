import { BaseService } from '@/services/http/base.service'
import type { KYCDocument, KYCStatus } from '@/types'

class KYCService extends BaseService {
  constructor() {
    super('/kyc')
  }

  getStatus() {
    return this.get<{ status: KYCStatus; document?: KYCDocument }>('/status')
  }

  submit(formData: FormData) {
    return this.upload<KYCDocument>('/submit', formData)
  }

  getDocument(id: string) {
    return this.get<KYCDocument>(`/documents/${id}`)
  }
}

export const kycService = new KYCService()
