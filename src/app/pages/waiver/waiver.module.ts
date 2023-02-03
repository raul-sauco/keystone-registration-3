import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';

import { WaiverRoutingModule } from './waiver-routing.module';
import { WaiverComponent } from './waiver.component';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingSpinnerContentModule } from 'src/app/components/loading-spinner-content/loading-spinner-content.module';
import { LoginRequiredMessageModule } from 'src/app/components/login-required-message/login-required-message.module';
import { WaiverContentComponent } from './waiver-content/waiver-content.component';

@NgModule({
  declarations: [WaiverComponent, WaiverContentComponent],
  imports: [
    CommonModule,
    FormsModule,
    LoadingSpinnerContentModule,
    LoginRequiredMessageModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatMomentDateModule,
    MatProgressBarModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    TranslateModule,
    WaiverRoutingModule,
  ],
})
export class WaiverModule {}
