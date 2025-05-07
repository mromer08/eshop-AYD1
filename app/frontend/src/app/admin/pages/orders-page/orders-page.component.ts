import { Component, computed, inject, OnInit } from '@angular/core';
import { OrderService } from '../../../shared/services/order.service';
import { finalize } from 'rxjs';
import { Order, Status } from '../../../shared/interfaces/order.interface';
import { SnackBarService } from '../../../shared/services/snack-bar.service';

@Component({
  selector: 'app-orders-page',
  templateUrl: './orders-page.component.html',
  styles: ``
})
export class OrdersPageComponent implements OnInit {

  private orderService = inject(OrderService);
  private snackBarService = inject(SnackBarService);

  private orders = computed(() => this.orderService.orders());

  public isLoading: boolean = true;
  public status: string[] = [
    'En Proceso',
    'Enviadas',
    'Entregadas'
  ];

  constructor() { }

  ngOnInit(): void {
    this.orderService.getOrders().pipe(
      finalize(() => this.isLoading = false)
    ).subscribe();
  }

  public returnColor(status: string): string {
    switch (status) {
      case 'En Proceso':
        return 'primary';
      default:
        return 'accent';
    }
  }

  public returnIcon(status: string): string {
    switch (status) {
      case 'En Proceso':
        return 'local_shipping';
      default:
        return 'verified';
    }
  }

  public returnAction(status: string): string {
    switch (status) {
      case 'En Proceso':
        return 'Enviar';
      default:
        return 'Marcar como Completado';
    }
  }

  public classifyOrders(status: string): Order[] {
    switch (status) {
      case 'En Proceso':
        return this.orders().filter(order => order.status === 'Processing');
      case 'Enviadas':
        return this.orders().filter(order => order.status === 'Shipped');
      default:
        return this.orders().filter(order => order.status === 'Delivered');
    }
  }

  public updateStatus(status: string, order_id: string) {
    const newStatus: Status = status === 'En Proceso' ? 'Shipped' : 'Delivered';
    this.orderService.updataOrderStatusById(order_id, newStatus).subscribe({
      next: () => this.snackBarService.showSuccess('Estado de orden actualizado.'),
      error: () => this.snackBarService.showError('No se pudo actualizar el estado de la orden.')
    });
  }

}
