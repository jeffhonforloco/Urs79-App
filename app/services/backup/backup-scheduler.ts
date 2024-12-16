import { DataBackupService } from './data-backup';
import { ErrorTracker } from '../monitoring/error-tracker';

export class BackupScheduler {
  private static readonly BACKUP_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours

  static startScheduledBackups(userId: string): void {
    setInterval(async () => {
      try {
        await DataBackupService.backupUserData(userId);
      } catch (error) {
        ErrorTracker.trackError(error as Error, {
          context: 'scheduled_backup',
          userId
        });
      }
    }, this.BACKUP_INTERVAL);
  }
}