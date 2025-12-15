export interface JwtPayload {
    userId: number;
    accessId: number;
    roleId: number;
    roleName: string;
    email: string;
    clinicId?: number;
}