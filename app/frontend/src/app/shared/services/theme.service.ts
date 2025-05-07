import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private _isDarkTheme = signal<boolean>(false);

  public isDarkTheme = computed(() => this._isDarkTheme());

  constructor() { }

  public toggleTheme(): void {
    this._isDarkTheme.set(!this.isDarkTheme());
    localStorage.setItem('theme', this.isDarkTheme() ? 'dark' : 'light');
    this.updateBodyClass();
  }

  private updateBodyClass(): void {
    if (this.isDarkTheme()) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }

  public loadUserTheme(): void {
    const savedTheme = localStorage.getItem('theme');
    this._isDarkTheme.set(savedTheme === 'dark');
    this.updateBodyClass();
  }

}