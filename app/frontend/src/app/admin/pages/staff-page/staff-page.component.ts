import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PermissionType, UserResponse } from '../../../auth/interfaces/user.interface';

@Component({
  selector: 'app-staff-page',
  templateUrl: './staff-page.component.html',
  styles: ``
})
export class StaffPageComponent implements OnInit {

  private activatedRoute = inject(ActivatedRoute);

  public users: UserResponse[] = [];

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ users }) => {
      this.users = users;
    });
  }

}
