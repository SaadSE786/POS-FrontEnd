import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SetupRoutingModule } from './setup-routing.module';
import { MaterialModule } from '../shared/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';

import { ChartOfAccountComponent } from './component/chart-of-account/chart-of-account.component';


@NgModule({
  declarations: [
    ChartOfAccountComponent
  ],
  imports: [
    CommonModule,
    SetupRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class SetupModule { }
