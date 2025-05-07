import { Component, inject, OnInit } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'shared-theme-switcher',
  templateUrl: './theme-switcher.component.html',
  styles: ''
})
export class ThemeSwitcherComponent implements OnInit {

  private themeService = inject(ThemeService);

  public themeIcon: 'dark_mode' | 'light_mode' = 'dark_mode';

  ngOnInit(): void {
    if (this.themeService.isDarkTheme()) {
      this.themeIcon = 'light_mode';
    }
  }

  public toggleTheme(): void {
    this.themeService.toggleTheme();
    if (this.themeService.isDarkTheme()) {
      this.themeIcon = 'light_mode';
    } else {
      this.themeIcon = 'dark_mode';
    }
  }

  public returnTooltip(): string {
    if (this.themeService.isDarkTheme()) return 'Modo Claro';
    return 'Modo Oscuro';
  }

}