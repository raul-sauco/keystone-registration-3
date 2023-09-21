import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { MarkdownModule } from 'ngx-markdown';

import { AdminBannerModule } from '@components/admin-banner/admin-banner.module';
import { LoadingSpinnerContentModule } from '@components/loading-spinner-content/loading-spinner-content.module';
import { LoginRequiredMessageModule } from '@components/login-required-message/login-required-message.module';
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
    MatCardModule,
    TranslateModule,
  ],
})
export class GuidesModule {}
