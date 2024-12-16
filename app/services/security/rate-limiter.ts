class RateLimiter {
  private attempts: Map<string, { count: number; timestamp: number }> = new Map();
  private readonly MAX_ATTEMPTS = 5;
  private readonly WINDOW_MS = 15 * 60 * 1000; // 15 minutes

  checkLimit(key: string): boolean {
    const now = Date.now();
    const attempt = this.attempts.get(key);

    if (!attempt) {
      this.attempts.set(key, { count: 1, timestamp: now });
      return true;
    }

    if (now - attempt.timestamp > this.WINDOW_MS) {
      this.attempts.set(key, { count: 1, timestamp: now });
      return true;
    }

    if (attempt.count >= this.MAX_ATTEMPTS) {
      return false;
    }

    attempt.count++;
    return true;
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }
}

export const rateLimiter = new RateLimiter();