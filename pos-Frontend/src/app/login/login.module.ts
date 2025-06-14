import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './component/login/login.component';
import { InitialPageLoaderComponent } from '../shared/component/initial-page-loader/initial-page-loader.component';
import { MaterialModule } from './../shared/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SignupComponent } from './component/signup/signup.component';


@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent
  ],
  exports: [
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
