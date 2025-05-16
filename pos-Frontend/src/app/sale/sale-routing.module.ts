import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SaleVoucherComponent } from './components/sale-voucher/sale-voucher.component';

const routes: Routes = [
  { path: 'saleVoucher', component: SaleVoucherComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SaleRoutingModule {}
