import { Component, inject, OnInit } from '@angular/core';
import { StoreSettingsService } from '../../../shared/services/store-settings.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { nitPattern, phonePattern } from '../../../shared/validators/patterns';
import { SnackBarService } from '../../../shared/services/snack-bar.service';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styles: ``
})
export class SettingsPageComponent implements OnInit {

  private formBuilder = inject(FormBuilder);
  private snackBarService = inject(SnackBarService);
  private storeSettingsService = inject(StoreSettingsService);

  public image?: string;

  public settingsForm: FormGroup = this.formBuilder.group({
    name:         [null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    nit:          [null, [Validators.required, Validators.pattern(nitPattern)]],
    image:        [null],
    phone_number: [null, [Validators.required, Validators.pattern(phonePattern)]],
    address:      [null, [Validators.required, Validators.minLength(5), Validators.maxLength(100)]]
  });

  ngOnInit(): void {
    if (this.storeSettingsService.settings()) {
      const { name, nit, logo_url, address, phone_number} = this.storeSettingsService.settings()!;
      this.settingsForm.patchValue({
        name,
        nit,
        address,
        phone_number
      });
      this.image = logo_url;
    }
  }

  private makeFormData(): FormData {
    const formdata: FormData = new FormData();
    const data = this.settingsForm.value;
    Object.keys(data).forEach(key => {
      if (data[key]) formdata.append(key, data[key]);
    });
    return formdata;
  }

  public catchImage(image: File): void {
    this.settingsForm.patchValue({ image });
  }

  public updateSettings(): void {
    if (this.settingsForm.valid) {
      this.storeSettingsService.updateSettings(this.makeFormData()).subscribe({
        next: () => this.snackBarService.showSuccess('Configuracion actualizada.'),
        error: () => this.snackBarService.showError('No se pudo actualizar la configuracion.')
      });
    }
  }

}
