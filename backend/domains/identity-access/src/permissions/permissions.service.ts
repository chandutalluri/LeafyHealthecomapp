import { Injectable } from '@nestjs/common';
import { CreatePermissionDto, UpdatePermissionDto } from './dto/permissions.dto';

export interface DomainPermission {
  id: string;
  userId: string;
  domain: string;
  actions: string[];
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class PermissionsService {
  private permissions: DomainPermission[] = [
    {
      id: '1',
      userId: 'admin-001',
      domain: 'catalog-management',
      actions: ['read', 'create', 'update', 'delete'],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      userId: 'admin-001',
      domain: 'order-management',
      actions: ['read', 'create', 'update'],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '3',
      userId: 'admin-001',
      domain: 'inventory-management',
      actions: ['read', 'create', 'update'],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '4',
      userId: 'admin-001',
      domain: 'payment-processing',
      actions: ['read', 'create'],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '5',
      userId: 'admin-001',
      domain: 'customer-service',
      actions: ['read', 'create', 'update'],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '6',
      userId: 'admin-001',
      domain: 'analytics-reporting',
      actions: ['read'],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '7',
      userId: 'admin-001',
      domain: 'accounting-management',
      actions: ['read', 'create', 'update'],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '8',
      userId: 'admin-001',
      domain: 'employee-management',
      actions: ['read', 'create', 'update'],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '9',
      userId: 'admin-001',
      domain: 'shipping-delivery',
      actions: ['read', 'create', 'update'],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  async getDomainPermissions(userId: string): Promise<Record<string, string[]>> {
    const userPermissions = this.permissions.filter(p => p.userId === userId);
    const domainMap: Record<string, string[]> = {};
    
    userPermissions.forEach(permission => {
      domainMap[permission.domain] = permission.actions;
    });
    
    return domainMap;
  }

  async createPermission(createPermissionDto: CreatePermissionDto): Promise<DomainPermission> {
    const newPermission: DomainPermission = {
      id: Date.now().toString(),
      ...createPermissionDto,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.permissions.push(newPermission);
    return newPermission;
  }

  async updatePermission(id: string, updatePermissionDto: UpdatePermissionDto): Promise<DomainPermission> {
    const permissionIndex = this.permissions.findIndex(p => p.id === id);
    if (permissionIndex === -1) {
      throw new Error('Permission not found');
    }
    
    this.permissions[permissionIndex] = {
      ...this.permissions[permissionIndex],
      ...updatePermissionDto,
      updatedAt: new Date()
    };
    
    return this.permissions[permissionIndex];
  }

  async deletePermission(id: string): Promise<void> {
    const permissionIndex = this.permissions.findIndex(p => p.id === id);
    if (permissionIndex === -1) {
      throw new Error('Permission not found');
    }
    
    this.permissions.splice(permissionIndex, 1);
  }

  async getAllPermissions(): Promise<DomainPermission[]> {
    return this.permissions;
  }
}