import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomButtonsComponent } from './component/custom-buttons/custom-buttons.component';
import { SidebarComponent } from './component/sidebar/sidebar.component';
import { MaterialModule } from './material/material.module';
import { RouterModule } from '@angular/router';
import { ToolbarComponent } from './component/toolbar/toolbar.component';
import { DashboardComponent } from './temp/dashboard/dashboard.component';
import { ContentComponent } from './temp/content/content.component';
import { AnalyticsComponent } from './temp/analytics/analytics.component';
import { CommentComponent } from './temp/comment/comment.component';
import { SharedRoutingModule } from './shared-routing.module';
import { MenuitemComponent } from './component/menuitem/menuitem.component';
import { UserProfileComponent } from './component/user-profile/user-profile.component';
import { ConfirmationDialogueComponent } from './component/confirmation-dialogue/confirmation-dialogue.component';
import { InitialPageLoaderComponent } from './component/initial-page-loader/initial-page-loader.component';


@NgModule({
  declarations: [
    CustomButtonsComponent,
    SidebarComponent,
    ToolbarComponent,
    DashboardComponent,
    ContentComponent,
    AnalyticsComponent,
    CommentComponent,
    MenuitemComponent,
    UserProfileComponent,
    ConfirmationDialogueComponent,
    InitialPageLoaderComponent
  ],
  exports: [
    SidebarComponent,
    ToolbarComponent,
    InitialPageLoaderComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    SharedRoutingModule
  ]
})
export class SharedModule { }
