import { Component, Input } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'customer-tool-bar',
  templateUrl: './customer-tool-bar.component.html',
  styles: ``
})
export class CustomerToolBarComponent {
  @Input({ required: true }) public sidenav!: MatSidenav;
}
