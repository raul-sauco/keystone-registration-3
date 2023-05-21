import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';

import { LoadingSpinnerContentModule } from '@components/loading-spinner-content/loading-spinner-content.module';
import { LoginRequiredMessageModule } from '@components/login-required-message/login-required-message.module';
import { MarkdownModule } from 'ngx-markdown';
import { WaiverContentComponent } from './waiver-content/waiver-content.component';
import { WaiverRoutingModule } from './waiver-routing.module';
import { WaiverComponent } from './waiver.component';

@NgModule({
  declarations: [WaiverComponent, WaiverContentComponent],
  imports: [
    CommonModule,
    FormsModule,
    LoadingSpinnerContentModule,
    LoginRequiredMessageModule,
    MarkdownModule,
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
