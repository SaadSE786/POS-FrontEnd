import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';

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
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./../app/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
  },
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
