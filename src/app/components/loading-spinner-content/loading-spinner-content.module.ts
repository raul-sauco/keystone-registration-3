import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerContentComponent } from './loading-spinner-content.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    MatProgressSpinnerModule
  ],
  declarations: [LoadingSpinnerContentComponent],
  exports: [LoadingSpinnerContentComponent]
})
export class LoadingSpinnerContentModule {}
