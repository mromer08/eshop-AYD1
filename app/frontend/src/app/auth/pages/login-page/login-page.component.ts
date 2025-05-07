import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { SnackBarService } from '../../../shared/services/snack-bar.service';
import { Router } from '@angular/router';
import { StoreSettingsService } from '../../../shared/services/store-settings.service';
import { navigateByRole } from '../../utils/role-navigation';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styles: ``
})
export class LoginPageComponent {

  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private snackBarService = inject(SnackBarService);
  private settingsService = inject(StoreSettingsService);

  public loginForm: FormGroup = this.formBuilder.group({
    email:    [null, [Validators.required]],
    password: [null, [Validators.required]]
  });

  constructor() { }

  public onLogin(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: () => {
          navigateByRole(this.router, this.authService.role().code);
          this.snackBarService.showSuccess(`Bienvenid@ a ${this.settingsService.settings()!.name}`);
        },
        error: () => this.snackBarService.showError('Credenciales incorrectas.')
      });
    }
  }

}
