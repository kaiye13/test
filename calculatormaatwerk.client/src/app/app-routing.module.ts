import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfiguredlistComponent } from './configuredlist/configuredlist.component'; // Import the component
import { ConfiguratorComponent } from './configurator/configurator.component';
import { ProductsComponent } from './products/products.component';

const routes: Routes = [
  {path: '', redirectTo: 'hubo/nl-BE', pathMatch: 'full'},
    { path: ':store/:language', component: ProductsComponent },

   { path: ':store/:language/configurator/:id', component: ConfiguratorComponent },

    { path: ':store/:language/configuredlist', component: ConfiguredlistComponent },

  // Add other routes here
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
