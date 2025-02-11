import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SetupRoutingModule } from './setup-routing.module';
import { MaterialModule } from '../shared/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';

import { ChartOfAccountComponent } from './component/chart-of-account/chart-of-account.component';
import { AddItemComponent } from './component/add-item/add-item.component';
import { AddWarehouseComponent } from './component/add-warehouse/add-warehouse.component';
import { AddTransporterComponent } from './component/add-transporter/add-transporter.component';


@NgModule({
  declarations: [
    ChartOfAccountComponent,
    AddItemComponent,
    AddWarehouseComponent,
    AddTransporterComponent
  ],
  imports: [
    CommonModule,
    SetupRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class SetupModule { }
