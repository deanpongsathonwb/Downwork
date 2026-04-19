import { Throttle } from '@nestjs/throttler'

export function AuthThrottle() {
  return Throttle({ default: { limit: 5, ttl: 60000 } })
}

export function StrictThrottle() {
  return Throttle({ default: { limit: 3, ttl: 60000 } })
}
