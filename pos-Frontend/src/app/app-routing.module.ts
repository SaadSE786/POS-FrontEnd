import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./../app/login/login.module').then((m) => m.LoginModule),
  },
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
  { path: '', redirectTo: 'auth', pathMatch: 'full' }, 
  { path: '**', redirectTo: 'auth' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
