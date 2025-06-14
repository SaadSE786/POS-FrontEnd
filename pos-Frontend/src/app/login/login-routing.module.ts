import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { SignupComponent } from './component/signup/signup.component';
import { InitialPageLoaderComponent } from '../shared/component/initial-page-loader/initial-page-loader.component';

const routes: Routes = [
    {
      path: '',
      component: InitialPageLoaderComponent,
      children: [
        { path: '', redirectTo: 'signin', pathMatch: 'full' },
  { path: 'signin', component: LoginComponent},
  { path: 'signup', component: SignupComponent},
      ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
