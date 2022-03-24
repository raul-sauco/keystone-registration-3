import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AdminBannerComponent } from './admin-banner.component';

@NgModule({
  declarations: [AdminBannerComponent],
  imports: [CommonModule, MatButtonModule, RouterModule, TranslateModule],
  exports: [AdminBannerComponent],
})
export class AdminBannerModule {}
