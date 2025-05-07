import { Component, inject, OnInit } from '@angular/core';
import { StoreSettingsService } from '../../../shared/services/store-settings.service';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.css'
})
export class AuthLayoutComponent implements OnInit {

  private storeSettingsService = inject(StoreSettingsService);
  public logo_url?: string;
  public name?: string;

  constructor() { }

  ngOnInit(): void {
    this.name = this.storeSettingsService.settings()?.name;
    this.logo_url = this.storeSettingsService.settings()?.logo_url;    
  }
}
