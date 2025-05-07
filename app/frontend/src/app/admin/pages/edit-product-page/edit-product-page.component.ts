import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../product/interfaces/product.interface';

@Component({
  selector: 'app-edit-product-page',
  templateUrl: './edit-product-page.component.html',
  styles: ``
})
export class EditProductPageComponent implements OnInit {

  private activatedRoute = inject(ActivatedRoute);

  public product?: Product;

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ product }) => {
      this.product = product;
    });
  }

}
