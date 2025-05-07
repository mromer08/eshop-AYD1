import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { navigateByRole } from '../../../auth/utils/role-navigation';

@Component({
  selector: 'app-error404-page',
  templateUrl: './error404-page.component.html',
  styleUrl: './error404-page.component.css'
})
export class Error404PageComponent {

  private router = inject(Router);
  private authService = inject(AuthService);

  public redirect(): void {
    navigateByRole(this.router, this.authService.role().code);
  }

}
