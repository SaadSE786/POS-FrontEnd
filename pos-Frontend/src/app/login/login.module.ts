import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './component/login/login.component';
import { InitialPageLoaderComponent } from './component/initial-page-loader/initial-page-loader.component';
import { MaterialModule } from './../shared/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    LoginComponent,
    InitialPageLoaderComponent
  ],
  exports: [
    InitialPageLoaderComponent,
    LoginComponent
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class LoginModule { }
