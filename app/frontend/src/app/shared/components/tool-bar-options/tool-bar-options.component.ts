import { Component, computed, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { AuthStatus } from '../../../auth/interfaces/auth.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarService } from '../../services/snack-bar.service';

@Component({
  selector: 'tool-bar-options',
  templateUrl: './tool-bar-options.component.html',
  styles: ``
})
export class ToolBarOptionsComponent {

  private router = inject(Router);
  private authService = inject(AuthService);
  private activatedRoute = inject(ActivatedRoute);
  private snackBarService = inject(SnackBarService);

  public photo?: string;
  public isAuth = computed(() => {
    if (this.authService.authStatus() === AuthStatus.Authenticated) {
      this.photo = this.authService.user()?.image_url;
      return true;
    } else {
      this.photo = undefined;
      return false;
    }
  });

  constructor() { }

  public redirect(button: 'login' | 'register'): void {
    if (button === 'login') {
      this.router.navigateByUrl('/auth');
    } else {
      this.router.navigateByUrl('/auth/register');
    }
  }

  public onLogout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/');
    this.snackBarService.showSuccess('Sigue disfrutando.');
  }

  public redirectToMyAccount(): void {
    this.router.navigate(['./my-account'], { relativeTo: this.activatedRoute });
  }

}
