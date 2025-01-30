import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './temp/dashboard/dashboard.component';
import { ContentComponent } from './temp/content/content.component';
import { AnalyticsComponent } from './temp/analytics/analytics.component';
import { CommentComponent } from './temp/comment/comment.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/dashboard' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'content', component: ContentComponent },
  { path: 'analytics', component: AnalyticsComponent },
  { path: 'comments', component: CommentComponent },
  { path: 'setup', loadChildren: () => import('./../setup/setup.module').then(m => m.SetupModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SharedRoutingModule { }
