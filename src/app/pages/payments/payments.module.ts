import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MarkdownModule } from 'ngx-markdown';
import { LoadingSpinnerContentModule } from 'src/app/components/loading-spinner-content/loading-spinner-content.module';
import { LoginRequiredMessageModule } from 'src/app/components/login-required-message/login-required-message.module';
import { PaymentClosedComponent } from './payment-closed/payment-closed.component';
import {
  AddParticipantInfoToPaymentReminderDialogComponent,
  PaymentInstructionsComponent,
} from './payment-instructions/payment-instructions.component';
import { PaymentQrCodesComponent } from './payment-qr-codes/payment-qr-codes.component';
import { PaymentTermsComponent } from './payment-terms/payment-terms.component';
import { PaymentUploadProofComponent } from './payment-upload-proof/payment-upload-proof.component';
import {
  PaymentCompletedConfirmationDialogComponent,
  PaymentUploadedComponent,
} from './payment-uploaded/payment-uploaded.component';
import { PaymentsRoutingModule } from './payments-routing.module';
import { PaymentsComponent } from './payments.component';

const routes: Routes = [{ path: '', component: PaymentsComponent }];

@NgModule({
  declarations: [
    AddParticipantInfoToPaymentReminderDialogComponent,
    PaymentCompletedConfirmationDialogComponent,
    PaymentsComponent,
    PaymentTermsComponent,
    PaymentQrCodesComponent,
    PaymentInstructionsComponent,
    PaymentUploadProofComponent,
    PaymentUploadedComponent,
    PaymentClosedComponent,
  ],
  imports: [
    CommonModule,
    LoadingSpinnerContentModule,
    LoginRequiredMessageModule,
    MarkdownModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatSnackBarModule,
    PaymentsRoutingModule,
    RouterModule.forChild(routes),
    TranslateModule,
  ],
})
export class PaymentsModule {}
