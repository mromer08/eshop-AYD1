import { Component, computed, inject, Input, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from '../../interfaces/product.interface';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { namePattern } from '../../../shared/validators/patterns';
import { ProductService } from '../../services/product.service';
import { SnackBarService } from '../../../shared/services/snack-bar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'product-form',
  templateUrl: './product-form.component.html',
  styles: ``
})
export class ProductFormComponent implements OnInit {

  @Input() public mode: 'edit' | 'add' = 'add';
  @Input() public product?: Product;

  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private snackBarService = inject(SnackBarService);

  public categories = computed(() => this.categoryService.categories());
  public productCat: Set<string> = new Set<string>();
  public buttonMode?: string;
  public iconMode?: string;
  public image?: string;

  public productForm: FormGroup = this.formBuilder.group({
    name: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    price: [0, [Validators.required, Validators.min(0)]],
    image: [null, [Validators.required]],
    description: [null, [Validators.required, Validators.minLength(10)]]
  });

  constructor() { }

  ngOnInit(): void {
    if (this.mode === 'add') {
      this.buttonMode = 'Agregar';
      this.iconMode = 'add_business';
    } else {
      this.buttonMode = 'Editar';
      this.iconMode = 'edit';
      if (!this.product) throw Error('Product property is required');
      this.loadProductInfo();
    }
  }

  private loadProductInfo(): void {
    const { name, stock, price, description, image_url, categories } = this.product!;
    this.productForm.get('image')?.clearValidators();
    this.productForm.get('image')?.updateValueAndValidity();
    categories.forEach((category) => this.productCat.add(category._id));
    this.image = image_url;
    this.productForm.patchValue({
      name,
      stock,
      price,
      description
    });
  }

  private makeFormData(): FormData {
    const formdata: FormData = new FormData();
    const productData = this.productForm.value;
    Object.keys(productData).forEach(key => {
      if (productData[key] !== null) formdata.append(key, productData[key]);
    });
    [...this.productCat].forEach((value) => {
      formdata.append('categories', value)
    })
    return formdata;
  }

  public catchImage(image: File): void {
    this.productForm.patchValue({ image });
  }

  public setProductCat(value: MatCheckboxChange, _id: string): void {
    if (value.checked) {
      this.productCat.add(_id);
    } else {
      this.productCat.delete(_id);
    }
  }

  public hasElement(_id: string): boolean {
    if (this.product) {
      return this.product.categories.some(category => category._id === _id);
    }
    return false;
  }

  private onAddProduct(formdata: FormData): void {
    this.productService.addProduct(formdata).subscribe({
      next: () => this.snackBarService.showSuccess('Producto agregado correctamente.'),
      error: () => this.snackBarService.showError('Algo salio mal al agregar el producto.')
    });
  }

  private onEditProduct(_id: string, formdata: FormData): void {
    this.productService.editProduct(_id, formdata).subscribe({
      next: () => this.snackBarService.showSuccess('Producto editado correctamente.'),
      error: () => this.snackBarService.showError('Algo salio mal al editar el producto.')
    });
  }

  public onSubmitProduct(): void {
    if (this.productForm.valid) {
      const formdata = this.makeFormData();
      if (this.mode === 'add') {
        this.onAddProduct(formdata);
      } else {
        this.onEditProduct(this.product!._id, formdata);
      }
    } else {
      this.snackBarService.showError('Campos invalidos.');
    }
  }

  public onCancel(): void {
    this.router.navigateByUrl('/admin');
  }

}
