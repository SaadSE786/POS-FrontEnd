import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./../app/shared/shared.module').then((m) => m.SharedModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('./../app/sale/sale.module').then((m) => m.SaleModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
