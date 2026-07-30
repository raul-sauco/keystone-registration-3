import { CdkScrollable } from '@angular/cdk/scrolling';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  computed,
  inject,
  resource,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButton, MatIconButton } from '@angular/material/button';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { MarkdownComponent } from 'ngx-markdown';
import { firstValueFrom, map } from 'rxjs';

import { ApiService } from '@services/api/api.service';
import { AuthService } from '@services/auth/auth.service';
import { GlobalsService } from '@services/globals/globals.service';
import { PaymentService } from '@services/payment/payment.service';

interface InstructionsJson {
  text: string;
  text_zh: string;
}

@Component({
  selector: 'app-payment-instructions',
  templateUrl: './payment-instructions.component.html',
  styleUrls: ['./payment-instructions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MarkdownComponent, MatIconButton, MatIcon, MatProgressSpinner, TranslatePipe],
})
export class PaymentInstructionsComponent implements OnInit, OnDestroy {
  private readonly dialog = inject(MatDialog);
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);
  private readonly logger = inject(NGXLogger);
  private readonly paymentService = inject(PaymentService);
  private readonly translate = inject(TranslateService);

  timeoutId: number | null = null;
  helpOpen = signal(false);

  readonly currentLang = toSignal(this.translate.onLangChange.pipe(map((event) => event.lang)), {
    initialValue: this.translate.getCurrentLang(),
  });

  readonly contentResource = resource({
    params: () => this.auth.credentialsSignal(),
    loader: async ({ params: credentials }) => {
      if (!credentials) {
        return null;
      }
      const endpoint = `payment-instructions/${credentials.studentId}`;
      return await this.api.getAsync<InstructionsJson>(endpoint);
    },
  });

  readonly contentSignal = computed(() => {
    const doc = this.contentResource.value();
    if (!doc) {
      return null;
    }
    return this.currentLang().includes('zh') ? doc.text_zh : doc.text;
  });

  ngOnInit(): void {
    this.logger.debug('PaymentInstructionsComponent::onInit()');
    // Need to use window.setTimeout to differentiate from NodeJS.Timeout.
    // https://stackoverflow.com/q/51040703/2557030
    this.timeoutId = window.setTimeout(() => this.displayWarning(), 5000);
  }

  ngOnDestroy(): void {
    if (this.timeoutId !== null) {
      window.clearTimeout(this.timeoutId);
    }
  }

  async displayWarning(): Promise<void> {
    if (this.paymentService.paymentInfo.value()?.paid) {
      return;
    }
    const dialogRef = this.dialog.open(AddParticipantInfoToPaymentReminderDialogComponent);
    await firstValueFrom(dialogRef.afterClosed());
  }

  async displayPaymentProofHelp(): Promise<void> {
    if (this.helpOpen()) {
      return;
    }
    this.helpOpen.set(true);
    const dialogRef = this.dialog.open(AddStudentNameToPaymentProofHelpDialogComponent);
    await firstValueFrom(dialogRef.afterClosed());
    this.helpOpen.set(false);
  }
}

@Component({
  selector: 'app-add-participant-info-to-payment-reminder-dialog-component',
  templateUrl: './add-participant-info-to-payment-reminder-dialog.component.html',
  styleUrls: ['./add-participant-info-to-payment-reminder-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogTitle,
    CdkScrollable,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    TranslatePipe,
  ],
})
export class AddParticipantInfoToPaymentReminderDialogComponent {
  dialogRef =
    inject<MatDialogRef<AddParticipantInfoToPaymentReminderDialogComponent>>(MatDialogRef);

  exampleImgUrl: string;
  constructor() {
    const globals = inject(GlobalsService);
    const translate = inject(TranslateService);

    this.exampleImgUrl =
      globals.getResUrl() +
      'img/portal/example-payment-proof-' +
      (translate.getCurrentLang().includes('zh') ? 'zh' : 'en') +
      '.png';
  }
}

@Component({
  selector: 'app-add-student-name-to-payment-proof-help-dialog-component',
  templateUrl: './add-student-name-to-payment-proof-help-dialog.component.html',
  styleUrls: ['./add-student-name-to-payment-proof-help-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CdkScrollable, MatDialogContent],
})
export class AddStudentNameToPaymentProofHelpDialogComponent {
  dialogRef = inject<MatDialogRef<AddStudentNameToPaymentProofHelpDialogComponent>>(MatDialogRef);

  exampleImgUrl: string;
  constructor() {
    const globals = inject(GlobalsService);
    const translate = inject(TranslateService);

    this.exampleImgUrl =
      globals.getResUrl() +
      'img/portal/example-payment-proof-' +
      (translate.getCurrentLang().includes('zh') ? 'zh' : 'en') +
      '.png';
  }
}
