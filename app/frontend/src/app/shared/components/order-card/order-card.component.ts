import { Component, Input } from '@angular/core';
import { Order } from '../../interfaces/order.interface';

@Component({
  selector: 'shared-order-card',
  templateUrl: './order-card.component.html',
  styles: ``
})
export class OrderCardComponent {

  @Input({ required: true }) public order!: Order;

  public returnIcon(): string {
    switch (this.order.status) {
      case 'Processing':
        return 'pending';
      case 'Shipped':
        return 'schedule_send';
      default:
        return 'assignment_turned_in';
    }
  }

  public returnColor(): string {
    switch (this.order.status) {
      case 'Processing':
        return 'warn';
      case 'Shipped':
        return 'primary';
      default:
        return 'accent';
    }
  }

}
