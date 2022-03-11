import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';
import { AdminBannerModule } from 'src/app/components/admin-banner/admin-banner.module';
import { LoadingSpinnerContentModule } from 'src/app/components/loading-spinner-content/loading-spinner-content.module';
import { LoginRequiredMessageModule } from 'src/app/components/login-required-message/login-required-message.module';
import { GuidesRoutingModule } from './guides-routing.module';
import { GuidesComponent } from './guides.component';

@NgModule({
  declarations: [GuidesComponent],
  imports: [
    AdminBannerModule,
    CommonModule,
    GuidesRoutingModule,
    LoadingSpinnerContentModule,
    LoginRequiredMessageModule,
    MarkdownModule.forChild(),
  ],
})
export class GuidesModule {}
