import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSliderModule } from '@angular/material/slider';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader'; // Import TranslateHttpLoader
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { AppComponent } from './app.component';
import { ProductsComponent } from './products/products.component';
import { ConfiguratorComponent } from './configurator/configurator.component';
import { ConfiguredlistComponent } from './configuredlist/configuredlist.component';
import { ProductCategoryComponent } from './products/product-category/product-category.component';
import { ProductFiltersComponent } from './products/product-filters/product-filters.component';
import { FilterComponent } from './products/product-filters/filter/filter.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpProductService } from './httpproduct.service';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ValueRangeDirective } from './directives/valuerange.directive' ;
import { MaxValueDirective } from './directives/max-value.directive';
import { ConfigService } from './config-service.service';
import { ThemeService } from './theme.service';


export function initConfig(config: ConfigService) {
  return () => config.loadConfig();
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    ProductsComponent,
    ConfiguratorComponent,
    ConfiguredlistComponent,
    ProductCategoryComponent,
    ProductFiltersComponent,
    FilterComponent,
    ValueRangeDirective,
    MaxValueDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    AppRoutingModule,
    MatSliderModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
    HttpProductService,
    ThemeService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }