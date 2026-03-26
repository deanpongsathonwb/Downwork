import { BaseService } from '@/services/http/base.service'
import type { Review } from '@/types'

class ReviewService extends BaseService {
  constructor() {
    super('/reviews')
  }

  getForUser(userId: string) {
    return this.get<Review[]>(`/user/${userId}`)
  }

  getById(id: string) {
    return this.get<Review>(`/${id}`)
  }

  report(id: string, reason: string) {
    return this.post<void>(`/${id}/report`, { reason })
  }
}

export const reviewService = new ReviewService()
