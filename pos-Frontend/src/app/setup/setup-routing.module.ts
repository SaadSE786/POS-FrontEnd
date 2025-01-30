import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChartOfAccountComponent } from './component/chart-of-account/chart-of-account.component';

const routes: Routes = [
  { path: 'chartOfAccount', component: ChartOfAccountComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SetupRoutingModule { }
