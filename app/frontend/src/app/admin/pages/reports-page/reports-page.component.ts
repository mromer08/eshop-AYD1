import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LegendPosition } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-reports-page',
  templateUrl: './reports-page.component.html',
  styles: ``
})
export class ReportsPageComponent implements OnInit {

  private activatedRoute = inject(ActivatedRoute);

  public lp: LegendPosition = LegendPosition.Below;

  public topSellingProducts: Report[] = [];
  public topCustomers: Report[] = [];
  public topSpending: Report[] = [];
  public topShipping: Report[] = [];
  public topPayment: Report[] = [];
  public topStatus: Report[] = [];

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ reports }) => {
      this.topSellingProducts = reports.topSellingProducts;
      this.topCustomers = reports.topCustomers;
      this.topSpending = reports.topSpending;
      this.topShipping = reports.topShipping;
      this.topPayment = reports.topPayment;
      this.topStatus = reports.topStatus;
    });
  }

}
