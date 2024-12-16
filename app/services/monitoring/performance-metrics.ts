import { PerformanceMonitor } from './performance-monitor';

export class PerformanceMetrics {
  private static readonly monitor = PerformanceMonitor.getInstance();

  static trackApiCall(endpoint: string, duration: number): void {
    this.monitor.trackMetric(`api_call_${endpoint}`, duration);
  }

  static trackImageLoad(imageType: string, duration: number): void {
    this.monitor.trackMetric(`image_load_${imageType}`, duration);
  }

  static trackMatchingAlgorithm(duration: number): void {
    this.monitor.trackMetric('matching_algorithm', duration);
  }

  static getAverageApiLatency(endpoint: string): number {
    return this.monitor.getAverageMetric(`api_call_${endpoint}`);
  }
}