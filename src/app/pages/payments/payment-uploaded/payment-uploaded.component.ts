import { Component, computed, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';

import { AuthService } from '@services/auth/auth.service';
import { GlobalsService } from '@services/globals/globals.service';
import { PaymentService } from '@services/payment/payment.service';
import { StudentService } from '@services/student/student.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-payment-uploaded',
  templateUrl: './payment-uploaded.component.html',
  styleUrls: ['./payment-uploaded.component.scss'],
  imports: [MatButton, MatIcon, MatProgressSpinner, TranslatePipe],
})
export class PaymentUploadedComponent {
  private auth = inject(AuthService);
  private globals = inject(GlobalsService);
  private logger = inject(NGXLogger);
  private router = inject(Router);
  private studentService = inject(StudentService);

  dialog = inject(MatDialog);
  paymentService = inject(PaymentService);

  staticUrl = computed(() => {
    const credentials = this.auth.credentialsSignal();
    if (!credentials) {
      return null;
    }
    return this.globals.getResUrl() + 'img/trip/pop/' + credentials.studentId + '/';
  });

  async navigateAway(): Promise<void> {
    this.logger.debug('User navigating away from payment-uploaded component');

    const confirmed = await firstValueFrom(
      this.dialog.open(PaymentCompletedConfirmationDialogComponent).afterClosed(),
    );

    if (!confirmed) {
      return;
    }

    const student = this.studentService.student();

    if (!student) {
      this.logger.warn('Navigate away called without loaded student');
      return;
    }

    let destinationPage = '/home';
    if (!student.hasProvidedInformation()) {
      destinationPage = '/personal-info';
    } else if (!student.waiverAccepted) {
      destinationPage = '/waiver';
    }

    await this.router.navigateByUrl(destinationPage);
  }
}

@Component({
  selector: 'app-payment-completed-confirmation-dialog-component',
  templateUrl: './payment-completed-confirmation-dialog.component.html',
  styleUrls: ['./payment-completed-confirmation-dialog.component.scss'],
  imports: [MatDialogTitle, MatDialogActions, MatButton, MatDialogClose, TranslatePipe],
})
export class PaymentCompletedConfirmationDialogComponent {
  dialogRef = inject<MatDialogRef<PaymentCompletedConfirmationDialogComponent>>(MatDialogRef);
}
