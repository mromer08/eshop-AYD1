import { Component, inject, Input, OnInit } from '@angular/core';
import { StoreSettingsService } from '../../services/store-settings.service';

@Component({
  selector: 'shared-tool-bar',
  templateUrl: './tool-bar.component.html',
  styles: ``
})
export class ToolBarComponent implements OnInit {

  @Input() public color: string = 'primary';

  private storeSettingsService = inject(StoreSettingsService);

  public logo_url?: string;
  public name?: string;

  constructor() { }

  ngOnInit(): void {
    this.logo_url = this.storeSettingsService.settings()?.logo_url;
    this.name = this.storeSettingsService.settings()?.name;
  }

}
