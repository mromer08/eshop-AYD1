import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeSwitcherComponent } from './components/theme-switcher/theme-switcher.component';
import { MaterialModule } from '../material/material.module';
import { OutlinedIconDirective } from './directives/outlined-icon.directive';
import { AddPhotoComponent } from './components/add-photo/add-photo.component';
import { SnackBarComponent } from './components/snack-bar/snack-bar.component';
import { Error404PageComponent } from './pages/error404-page/error404-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { ToolBarComponent } from './components/tool-bar/tool-bar.component';
import { ToolBarOptionsComponent } from './components/tool-bar-options/tool-bar-options.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OrderCardComponent } from './components/order-card/order-card.component';



@NgModule({
  declarations: [
    ThemeSwitcherComponent,
    OutlinedIconDirective,
    AddPhotoComponent,
    SnackBarComponent,
    Error404PageComponent,
    ProfilePageComponent,
    ToolBarComponent,
    ToolBarOptionsComponent,
    OrderCardComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  exports: [
    ThemeSwitcherComponent,
    AddPhotoComponent,
    OutlinedIconDirective,
    ToolBarComponent,
    OrderCardComponent
  ]
})
export class SharedModule { }
