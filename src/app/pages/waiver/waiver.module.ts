import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WaiverRoutingModule } from './waiver-routing.module';
import { WaiverComponent } from './waiver.component';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingSpinnerContentModule } from 'src/app/components/loading-spinner-content/loading-spinner-content.module';
import { LoginRequiredMessageModule } from 'src/app/components/login-required-message/login-required-message.module';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { WaiverContentComponent } from './waiver-content/waiver-content.component';

@NgModule({
  declarations: [WaiverComponent, WaiverContentComponent],
  imports: [
    CommonModule,
    LoadingSpinnerContentModule,
    LoginRequiredMessageModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatMomentDateModule,
    MatSnackBarModule,
    TranslateModule,
    WaiverRoutingModule,
  ],
})
export class WaiverModule {}
