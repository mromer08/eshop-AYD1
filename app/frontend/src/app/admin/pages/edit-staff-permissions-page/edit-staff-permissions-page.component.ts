import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrentPermission, PermissionType, UserResponse } from '../../../auth/interfaces/user.interface';
import { AdminService } from '../../services/admin.service';
import { SnackBarService } from '../../../shared/services/snack-bar.service';

@Component({
  selector: 'app-edit-staff-permissions-page',
  templateUrl: './edit-staff-permissions-page.component.html',
  styles: ``
})
export class EditStaffPermissionsPageComponent implements OnInit {

  private snackBarService = inject(SnackBarService);
  private activatedRoute = inject(ActivatedRoute);
  private adminService = inject(AdminService);
  private router = inject(Router);

  public permissionTypes: PermissionType[] = [];
  public userPermissions: CurrentPermission[] = [];
  public user?: UserResponse;

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ user, permissionType }) => {
      if (!user) throw Error('User does not exists.');
      this.user = user;
      this.permissionTypes = permissionType;
    });
  }

  public recibePermission(permissions: CurrentPermission[]) {
    this.userPermissions = permissions;
  }

  public onSave(): void {
    console.log(this.user?._id)
    this.adminService.editPermissions(this.user!._id, this.userPermissions).subscribe({
      next: () => {
        this.snackBarService.showSuccess('Permisos editados.');
        this.router.navigateByUrl('/admin/staff');
      },
      error: () => this.snackBarService.showError('No se pudo editar los permisos.')
    });
  }

}
