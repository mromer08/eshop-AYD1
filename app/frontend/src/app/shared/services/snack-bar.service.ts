import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../components/snack-bar/snack-bar.component';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  private snackBar = inject(MatSnackBar);

  constructor() { }

  private showSnackBar(message: string, color: string = 'accent', icon: string = 'check_circle'): void {
    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: 1500,
      data: {
        message,
        color,
        icon,
      },
    });
  }

  public showSuccess(message: string): void {
    this.showSnackBar(message);
  }

  public showInfo(message: string): void {
    this.showSnackBar(message, 'primary', 'info');
  }

  public showError(message: string): void {
    this.showSnackBar(message, 'warn', 'cancel');
  }

  public showCustomMsg(message: string, icon: string, color: string = 'accent') {
    this.showSnackBar(message, color, icon);
  }

}
