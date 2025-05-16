import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChartOfAccountComponent } from './component/chart-of-account/chart-of-account.component';
import { AddItemComponent } from './component/add-item/add-item.component';
import { AddWarehouseComponent } from './component/add-warehouse/add-warehouse.component';
import { AddTransporterComponent } from './component/add-transporter/add-transporter.component';
import { AddUserComponent } from './component/add-user/add-user.component';

const routes: Routes = [
  { path: 'chartOfAccount', component: ChartOfAccountComponent },
  { path: 'addItem', component: AddItemComponent },
  { path: 'addWarehouse', component: AddWarehouseComponent },
  { path: 'addTransporter', component: AddTransporterComponent },
  { path: 'addUser', component: AddUserComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SetupRoutingModule {}
