import { Component, inject, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Category } from '../../interfaces/product.interface';
import { CategoryService } from '../../services/category.service';
import { SnackBarService } from '../../../shared/services/snack-bar.service';

interface DialogData {
  mode:       'add' | 'edit';
  category?:  Category;
}

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styles: ``
})
export class CategoryFormComponent {

  private formBuilder = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  private snackBarService = inject(SnackBarService);

  public categoryForm: FormGroup = this.formBuilder.group({
    name: [this.data.category?.name, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]]
  });

  constructor(
    public dialogRef: MatDialogRef<CategoryFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  public onCancel(): void {
    this.dialogRef.close();
  }

  public onAdd(name: string): void {
    this.categoryService.createCategory(name).subscribe({
      next: () => this.snackBarService.showSuccess('Categoria agregada.'),
      error: () => this.snackBarService.showError('No se pudo agregar la categoria.')
    });
  }

  public onEdit(_id: string, name: string): void {
    this.categoryService.editCategory(_id, name).subscribe({
      next: () => this.snackBarService.showSuccess('Categoria editada.'),
      error: () => this.snackBarService.showError('No se pudo editar la categoria.')
    });
  }

  public onSubmit(): void {
    if (this.categoryForm.valid) {
      const { name } = this.categoryForm.value;
      const { mode, category } = this.data;
      if (mode === 'add') {
        this.onAdd(name);
      } else {
        this.onEdit(category!._id, name);
      }
      this.onCancel();
    } else {
      this.snackBarService.showError('Nombre invalido.');
    }
  }

}
