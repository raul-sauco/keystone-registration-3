import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { AdminBannerModule } from 'src/app/components/admin-banner/admin-banner.module';
import { LoadingSpinnerContentModule } from 'src/app/components/loading-spinner-content/loading-spinner-content.module';
import { LoginRequiredMessageModule } from 'src/app/components/login-required-message/login-required-message.module';
import { NoResultsModule } from 'src/app/components/no-results/no-results.module';
import { ProgramOverviewRoutingModule } from './program-overview-routing.module';
import { ProgramOverviewComponent } from './program-overview.component';

@NgModule({
  declarations: [ProgramOverviewComponent],
  imports: [
    AdminBannerModule,
    CommonModule,
    LoadingSpinnerContentModule,
    LoginRequiredMessageModule,
    MatIconModule,
    NoResultsModule,
    ProgramOverviewRoutingModule,
    TranslateModule,
  ],
})
export class ProgramOverviewModule {}
