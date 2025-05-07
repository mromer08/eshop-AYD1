import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Action, CurrentPermission, Permission, PermissionType } from '../../../auth/interfaces/user.interface';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'admin-staff-permissions',
  templateUrl: './staff-permissions.component.html',
  styles: ``
})
export class StaffPermissionsComponent implements OnInit {

  @Input({ required: true }) public permissionTypes!: PermissionType[];
  @Input() public userPermissions?: Permission[];
  @Output() public sendPermissions: EventEmitter<CurrentPermission[]> =  new EventEmitter<CurrentPermission[]>();

  private permissions: CurrentPermission[] = [];

  constructor() { }

  ngOnInit(): void {
    this.permissions = this.permissionTypes.map(permission => ({
      permissionType: permission._id,
      actions: []
    }));
    if (this.userPermissions && this.userPermissions.length !== 0) {
      this.userPermissions.forEach((currentP) => {
        const index = this.permissions.findIndex(permission => permission.permissionType === currentP.permissionType._id);
        if (index !== -1) {
          if (this.permissions[index].actions.length === 0) this.permissions[index].actions = currentP.actions;
        }
      });
      this.sendPermissions.emit(this.cleanPermissions());
    }
  }

  public returnAction(action: Action): string {
    switch (action) {
      case 'create':
        return 'Crear';
      case 'edit':
        return 'Editar';
      case 'view':
        return 'Obtener';
      default:
        return 'Eliminar';
    }
  }

  public hasElement(permissionType: string, action: Action): boolean {
    const index = this.permissions.findIndex(permission => permission.permissionType === permissionType);
    if (index !== -1) {
      return this.permissions[index].actions.includes(action);
    }
    return false;
  }

  public setPermissions(value: MatCheckboxChange, permissionType: string, action: Action): void {
    const index = this.permissions.findIndex(permission => permission.permissionType === permissionType);
    if (index !== -1) {
      if (value.checked) {
        if (!this.permissions[index].actions.includes(action)) {
          this.permissions[index].actions.push(action);
        }
      } else {
        const indexOf = this.permissions[index].actions.indexOf(action);
        if (indexOf !== -1) this.permissions[index].actions.splice(indexOf, 1);
      }
    }
    this.sendPermissions.emit(this.cleanPermissions());
  }

  public cleanPermissions(): CurrentPermission[] {
    const permissions: CurrentPermission[] = [];
    this.permissions.forEach(permission => {
      if (permission.actions.length !== 0) permissions.push(permission);
    });
    return permissions;
  }

}
