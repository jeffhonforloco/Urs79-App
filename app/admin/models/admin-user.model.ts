export interface AdminUser {
  id: string;
  email: string;
  role: 'super_admin' | 'admin' | 'moderator';
  permissions: string[];
  lastLogin: Date;
  createdAt: Date;
  status: 'active' | 'suspended' | 'inactive';
}

export interface AdminActivity {
  id: string;
  adminId: string;
  action: string;
  targetId?: string;
  targetType?: string;
  metadata: any;
  timestamp: Date;
  ipAddress: string;
}