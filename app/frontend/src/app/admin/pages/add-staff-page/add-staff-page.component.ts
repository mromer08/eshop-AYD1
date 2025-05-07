import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrentPermission, PermissionType, Role } from '../../../auth/interfaces/user.interface';
import { MatRadioChange } from '@angular/material/radio';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { emailPattern, namePattern, passwordPattern } from '../../../shared/validators/patterns';
import { isFieldOneEqualsFieldTwo } from '../../../shared/validators/validators';
import { Staff } from '../../interfaces/staff.interface';
import { AdminService } from '../../services/admin.service';
import { SnackBarService } from '../../../shared/services/snack-bar.service';

@Component({
  selector: 'app-add-staff-page',
  templateUrl: './add-staff-page.component.html',
  styles: `
    .disabled {
      pointer-events: none;
      opacity: 0.5;
    }
  `
})
export class AddStaffPageComponent implements OnInit {

  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private adminService = inject(AdminService);
  private activatedRoute = inject(ActivatedRoute);
  private snackBarService = inject(SnackBarService);

  private userPermissions: CurrentPermission[] = [];
  private roles: Role[] = [];

  public adminValue: string = 'ADMIN';
  public assistantValue: string = 'ASSISTANT';
  public permissionTypes: PermissionType[] = [];
  public willBeAdmin: boolean = false;
  public staffForm: FormGroup = this.formBuilder.group({
    name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(25), Validators.pattern(namePattern)]],
    lastname: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(25), Validators.pattern(namePattern)]],
    email: [null, [Validators.required, Validators.pattern(emailPattern)]],
    password: [null, [Validators.required, Validators.pattern(passwordPattern)]],
    c_password: [null, [Validators.required]]
  }, {
    validators: [
      isFieldOneEqualsFieldTwo('password', 'c_password')
    ]
  });

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ permissionType, role }) => {
      this.permissionTypes = permissionType;
      this.roles = role;
    });
  }

  public onRoleChange(event: MatRadioChange): void {
    if (event.value === this.adminValue) {
      this.willBeAdmin = true;
    } else {
      this.willBeAdmin = false;
    }
  }

  public recibePermission(permissions: CurrentPermission[]) {
    this.userPermissions = permissions;
  }

  private makeBody(): Staff {
    const { name, lastname, email, password } = this.staffForm.value;
    const adminIndex = this.roles.findIndex(role => role.name === this.adminValue);
    const assistantIndex = this.roles.findIndex(role => role.name === this.assistantValue);
    const role: string = this.willBeAdmin ? this.roles[adminIndex]._id! : this.roles[assistantIndex]._id!;
    const permissions: CurrentPermission[] = this.willBeAdmin ? [] : this.userPermissions;
    return {
      name,
      lastname,
      email,
      password,
      role,
      permissions
    };
  }

  public onCreateStaff(): void {
    if (this.staffForm.valid) {
      this.adminService.createStaff(this.makeBody()).subscribe({
        next: () => {
          this.snackBarService.showSuccess('Emplead@ agregado.');
          this.router.navigateByUrl('/admin/staff');
        },
        error: () => this.snackBarService.showError('No se pudo agregar el empleado.')
      })
    } else {
      this.snackBarService.showError('Campos invalidos.');
    }
  }

}
