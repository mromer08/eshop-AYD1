import { Component, inject, Input, OnInit } from '@angular/core';
import { Action, UserResponse } from '../../../auth/interfaces/user.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'admin-staff-card',
  templateUrl: './staff-card.component.html',
  styles: `
    .disabled {
      pointer-events: none;
      opacity: 0.5;
    }
  `
})
export class StaffCardComponent implements OnInit {

  @Input({ required: true }) public staff!: UserResponse;

  private router = inject(Router);
  public img_url = 'https://ayd1-p1-eshop.s3.amazonaws.com/62bb2fdef516b56a2136e2be6c4e9116b1ecef0fc616c27adf81fbbe3140da54.jpg';

  ngOnInit(): void {
    if (this.staff.image_url) {
      this.img_url = this.staff.image_url;
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

  onEditPermissions(_id: string): void {
    this.router.navigateByUrl(`/admin/edit-staff-permissions/${_id}`);
  }

}
