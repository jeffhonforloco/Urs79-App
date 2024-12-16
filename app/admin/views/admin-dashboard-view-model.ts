import { Observable } from '@nativescript/core';
import { AnalyticsService } from '../services/analytics.service';
import { UserManagementService } from '../services/user-management.service';
import { ModerationService } from '../services/moderation.service';

export class AdminDashboardViewModel extends Observable {
    private analyticsService: AnalyticsService;
    private userService: UserManagementService;
    private moderationService: ModerationService;

    public totalUsers: number = 0;
    public activeMatches: number = 0;
    public pendingReports: number = 0;

    constructor() {
        super();
        this.analyticsService = new AnalyticsService();
        this.userService = new UserManagementService();
        this.moderationService = new ModerationService();
        this.loadDashboardData();
    }

    private async loadDashboardData() {
        try {
            const [userStats, matchingStats] = await Promise.all([
                this.analyticsService.getUserStats(),
                this.analyticsService.getMatchingStats()
            ]);

            this.totalUsers = userStats.totalUsers || 0;
            this.activeMatches = matchingStats.activeMatches || 0;
            this.pendingReports = await this.getPendingReportsCount();

            this.notifyPropertyChange('totalUsers', this.totalUsers);
            this.notifyPropertyChange('activeMatches', this.activeMatches);
            this.notifyPropertyChange('pendingReports', this.pendingReports);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    }

    private async getPendingReportsCount(): Promise<number> {
        try {
            const reports = await this.moderationService.getReportedContent(1, 1);
            return reports.length;
        } catch (error) {
            console.error('Error getting pending reports count:', error);
            return 0;
        }
    }

    onUserManagement() {
        const frame = require('@nativescript/core').Frame;
        frame.topmost().navigate('admin/views/user-management-page');
    }

    onModeration() {
        const frame = require('@nativescript/core').Frame;
        frame.topmost().navigate('admin/views/moderation-page');
    }

    onAnalytics() {
        const frame = require('@nativescript/core').Frame;
        frame.topmost().navigate('admin/views/analytics-page');
    }

    onSettings() {
        const frame = require('@nativescript/core').Frame;
        frame.topmost().navigate('admin/views/settings-page');
    }

    onLogout() {
        const frame = require('@nativescript/core').Frame;
        frame.topmost().navigate({
            moduleName: 'views/auth/login-page',
            clearHistory: true
        });
    }
}