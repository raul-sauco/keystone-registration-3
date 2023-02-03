import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { MarkdownModule } from 'ngx-markdown';
import { AdminBannerModule } from 'src/app/components/admin-banner/admin-banner.module';
import { LoadingSpinnerContentModule } from 'src/app/components/loading-spinner-content/loading-spinner-content.module';
import { LoginRequiredMessageModule } from 'src/app/components/login-required-message/login-required-message.module';
import { PackingListItemModule } from 'src/app/components/packing-list-item/packing-list-item.module';
import { PackingListRoutingModule } from './packing-list-routing.module';
import { PackingListComponent } from './packing-list.component';

@NgModule({
  declarations: [PackingListComponent],
  imports: [
    AdminBannerModule,
    CommonModule,
    PackingListRoutingModule,
    MatIconModule,
    MatSnackBarModule,
    MatTabsModule,
    PackingListItemModule,
    TranslateModule,
    MarkdownModule.forChild(),
    LoadingSpinnerContentModule,
    LoginRequiredMessageModule,
  ],
})
export class PackingListModule {}
