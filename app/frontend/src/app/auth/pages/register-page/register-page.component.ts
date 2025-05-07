import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isFieldOneEqualsFieldTwo } from '../../../shared/validators/validators';
import { emailPattern, namePattern, passwordPattern } from '../../../shared/validators/patterns';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SnackBarService } from '../../../shared/services/snack-bar.service';
import { StoreSettingsService } from '../../../shared/services/store-settings.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styles: ``
})
export class RegisterPageComponent {

  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private snackBarService = inject(SnackBarService);
  private settingsService = inject(StoreSettingsService);

  public profileForm: FormGroup = this.formBuilder.group({
    name:     [null, [Validators.required, Validators.minLength(3), Validators.maxLength(25), Validators.pattern(namePattern)]],
    lastname: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(25), Validators.pattern(namePattern)]],
    image:    [null]
  });

  public accountForm: FormGroup = this.formBuilder.group({
    email:      [null, [Validators.required, Validators.pattern(emailPattern)]],
    password:   [null, [Validators.required, Validators.pattern(passwordPattern)]],
    c_password: [null, [Validators.required]]
  }, {
    validators: [
      isFieldOneEqualsFieldTwo('password', 'c_password')
    ]
  });

  constructor() { }

  private makeFormData(): FormData {
    const user = new FormData();
    const profile = this.profileForm.value;
    const account = this.accountForm.value;
    Object.keys(profile).forEach((key) => {
      if (profile[key]) {
        user.append(key, profile[key]);
      }
    });
    Object.keys(account).forEach((key) => {
      if (key !== 'c_password') user.append(key, account[key]);
    });
    return user;
  }

  public catchImage(image: File): void {
    this.profileForm.patchValue({ image });
  }

  public onRegister(): void {
    this.authService.register(this.makeFormData()).subscribe({
      next: () => {
        this.router.navigateByUrl('/');
        this.snackBarService.showSuccess(`Bienvenid@ a ${this.settingsService.settings()!.name}`);
      },
      error: () => this.snackBarService.showError('Algo salio mal.')
    });
  }

}
