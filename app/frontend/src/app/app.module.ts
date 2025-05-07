import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { initializeAuth, initializeConfig, initializeProducts } from './shared/utils/app-initializer';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [
    provideAnimationsAsync(),
    provideHttpClient(
      withInterceptors([])
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeConfig,
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeProducts,
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAuth,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
