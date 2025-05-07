export type Action = 'edit' | 'delete' | 'view' | 'create';

export interface PermissionType {
    _id:                string;
    name:               string;
    available_actions:  Action[];
}

export interface CurrentPermission {
    permissionType: string;
    actions:        Action[];
}

export interface Permission {
    _id?:           string;
    permissionType: PermissionType;
    actions:        Action[];
}

export interface Role {
    _id?:   string;
    code:   number;
    name:   string;
}

export interface User {
    _id:            string;
    name:           string;
    lastname:       string;
    nit?:           string;
    email:          string;
    image_url?:     string;
}

export interface UserResponse extends User {
    role:           Role;
    permissions:    Permission[]
}

export interface UpdateUser extends Partial<UserResponse> { }