import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'setup',
    loadChildren: () =>
      import('./../app/setup/setup.module').then((m) => m.SetupModule),
  },
  {
    path: 'sale',
    loadChildren: () =>
      import('./../app/sale/sale.module').then((m) => m.SaleModule),
  },
  { path: '', redirectTo: 'setup', pathMatch: 'full' }, // default route
  { path: '**', redirectTo: 'setup' }, // wildcard for 404s
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
