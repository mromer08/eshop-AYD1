import { Component, computed, inject } from '@angular/core';
import { CategoryService } from '../../../product/services/category.service';
import { SnackBarService } from '../../../shared/services/snack-bar.service';
import { Category } from '../../../product/interfaces/product.interface';
import { MatDialog } from '@angular/material/dialog';
import { CategoryFormComponent } from '../../../product/components/category-form/category-form.component';

interface CategoryElement extends Category {
  position: number;
}

@Component({
  selector: 'app-categories-page',
  templateUrl: './categories-page.component.html',
  styles: ``
})
export class CategoriesPageComponent {

  private matDialog = inject(MatDialog);
  private categoryService = inject(CategoryService);
  private snackBarService = inject(SnackBarService);

  public displayedColumns: string[] = ['position', 'name', 'actions'];
  public categories = computed<CategoryElement[]>(() => this.categoryService.categories().map((category, index) => ({
      ...category,
      position: index + 1
    }))
  );

  constructor() { }

  public onAdd(): void {
    this.matDialog.open(CategoryFormComponent, {
      data: {
        mode: 'add'
      }
    });
  }

  public onEdit(category: CategoryElement): void {
    const { position, ...cat } = category;
    this.matDialog.open(CategoryFormComponent, {
      data: {
        mode: 'edit',
        category: cat
      }
    });
  }

  public onDelete(_id: string): void {
    this.categoryService.deleteCategory(_id).subscribe({
      next: () => {
        this.snackBarService.showSuccess('Categoria eliminada');
      },
      error: () => this.snackBarService.showError('La categoria no se pudo eliminar')
    });
  }

}
