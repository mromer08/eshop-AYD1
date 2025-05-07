import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../auth/services/auth.service';
import { namePattern, nitPattern, passwordPattern } from '../../validators/patterns';
import { isFieldOneEqualsFieldTwo } from '../../validators/validators';
import { SnackBarService } from '../../services/snack-bar.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styles: ``
})
export class ProfilePageComponent implements OnInit {

  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private snackBarService = inject(SnackBarService);

  public userForm: FormGroup = this.formBuilder.group({
    name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(25), Validators.pattern(namePattern)]],
    lastname: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(25), Validators.pattern(namePattern)]],
    image_url: [null]
  });

  public pswdForm: FormGroup = this.formBuilder.group({
    current_password: [null, [Validators.required]],
    new_password: [null, [Validators.required, Validators.pattern(passwordPattern)]],
    c_password: [null, [Validators.required]]
  }, {
    validators: [
      isFieldOneEqualsFieldTwo('new_password', 'c_password')
    ]
  });

  public NIT: boolean = false;
  public url?: string;

  constructor() { }

  ngOnInit(): void {
    const { name, lastname, nit, image_url } = this.authService.user()!;
    this.userForm.patchValue({
      name,
      lastname
    });
    if (image_url) {
      this.url = image_url;
    }
    if (nit && this.authService.role().code === 2000) {
      this.NIT = true;
      this.userForm.addControl('nit', this.formBuilder.control(null, [Validators.required, Validators.pattern(nitPattern)]));
      this.userForm.patchValue({ nit });
    }
  }

  public catchImage(image_url: File): void {
    this.userForm.patchValue({ image_url });
  }

  private makeUserFormData(): FormData {
    const user = new FormData();
    const profile = this.userForm.value;
    Object.keys(profile).forEach((key) => {
      if (profile[key]) {
        user.append(key, profile[key]);
      }
    });
    return user;
  }

  public updateUser(): void {
    if (this.userForm.valid) {
      this.authService.updateUserInfo(this.makeUserFormData()).subscribe({
        next: () => this.snackBarService.showSuccess('Información actualizada correctamente.'),
        error: () => this.snackBarService.showError('Algo salio mal.')
      });
    }
  }

  public updatePswd(): void {
    if (this.pswdForm.valid) {
      const { current_password, new_password } = this.pswdForm.value;
      this.authService.updatePswd(current_password, new_password).subscribe({
        next: () => {
          this.snackBarService.showSuccess('Contraseña actualizada correctamente.');
          this.pswdForm.reset();
        },
        error: () => this.snackBarService.showError('Algo salio mal.')
      });
    }
  }

}
