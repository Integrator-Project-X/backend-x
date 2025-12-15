import { SetMetadata } from '@nestjs/common';

export const OWNERSHIP_KEY = 'ownership';

export type OwnershipResource = 'PET' | 'APPOINTMENT' | 'CLINIC';

export interface OwnershipConfig {
    resource: OwnershipResource;
    param: string;
    allowRoles?: string[];
}

export const Ownership = (config: OwnershipConfig) => SetMetadata(OWNERSHIP_KEY, config);