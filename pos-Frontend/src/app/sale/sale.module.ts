import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../shared/material/material.module';

import { SaleRoutingModule } from './sale-routing.module';
import { SaleVoucherComponent } from './components/sale-voucher/sale-voucher.component';

@NgModule({
  declarations: [SaleVoucherComponent],
  imports: [
    CommonModule,
    SaleRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
})
export class SaleModule {}
