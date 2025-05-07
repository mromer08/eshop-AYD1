import { inject } from "@angular/core";
import { Observable, switchMap } from "rxjs";
import { StoreSettingsService } from "../services/store-settings.service";
import { AuthService } from "../../auth/services/auth.service";
import { ThemeService } from "../services/theme.service";
import { CategoryService } from "../../product/services/category.service";
import { ProductService } from "../../product/services/product.service";

export const initializeConfig = (): () => Observable<boolean> => {
    const themeService = inject(ThemeService);
    const storeSettingsService = inject(StoreSettingsService);
    themeService.loadUserTheme();
    return () => storeSettingsService.getSettings();
}

export const initializeProducts = (): () => Observable<boolean> => {
    const productService = inject(ProductService);
    const categoryService = inject(CategoryService);
    return () => categoryService.getCategories().pipe(
        switchMap(() => productService.getProducts())
    );
}

export const initializeAuth = (): () => Observable<boolean> => {
    const authService = inject(AuthService);
    return () => authService.checkStatus();
}