import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { Subscription, finalize } from 'rxjs';

import { AuthService } from '@services/auth/auth.service';
import { GlobalsService } from '@services/globals/globals.service';
import { PaymentService } from '@services/payment/payment.service';

import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatProgressBar } from '@angular/material/progress-bar';

@Component({
    selector: 'app-payment-upload-proof',
    templateUrl: './payment-upload-proof.component.html',
    styleUrls: ['./payment-upload-proof.component.scss'],
    imports: [MatIcon, MatButton, MatProgressBar, TranslatePipe]
})
export class PaymentUploadProofComponent implements OnInit, OnDestroy {
  private auth = inject(AuthService);
  private http = inject(HttpClient);
  private globals = inject(GlobalsService);
  private snackBar = inject(MatSnackBar);
  private logger = inject(NGXLogger);
  private paymentService = inject(PaymentService);
  private translate = inject(TranslateService);

  file: File | null = null;
  imgSrc: string | ArrayBuffer | null = null;
  uploadProgress: number | null = null;
  uploadSub: Subscription | null = null;
  success = false;

  ngOnDestroy(): void {
    this.logger.debug('PaymentUploadProofComponent on destroy');
    this.uploadSub?.unsubscribe();
  }

  ngOnInit(): void {
    this.logger.debug('PaymentUploadProofComponent on init');
  }

  /**
   * Handle the user selecting a file.
   * It
   * @param event
   */
  onFileSelected(event: any) {
    this.logger.debug('PaymentUploadProofComponent::onFileSelected(event)');
    this.file = event.target.files[0];
    if (this.file) {
      const reader = new FileReader();
      reader.onload = (_) => (this.imgSrc = reader.result);
      reader.readAsDataURL(this.file);
      this.uploadFile();
    } else {
      this.snackBar.open(this.translate.instant('SELECT_VALID_FILE'));
    }
  }

  /**
   * Handle uploading the stored file to the server.
   */
  uploadFile(): void {
    this.logger.debug('PaymentUploadProofComponent::uploadFile()');
    if (this.file) {
      const formData = new FormData();
      const url = this.globals.getApiUrl() + 'trip-direct-payment-proof';
      const headers = new HttpHeaders({
        // 'Content-Type': Automatically assigned by the browser when it detects form data.
        Authorization: ' Bearer ' + this.auth.getAccessToken(),
      });
      formData.append('image', this.file);
      const upload$ = this.http
        .post(url, formData, {
          headers,
          reportProgress: true,
          observe: 'events',
        })
        .pipe(
          finalize(() => {
            this.success = true;
            this.reset();
          })
        );
      this.uploadSub = upload$.subscribe((event) => {
        if (event.type == HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round(100 * (event.loaded / event.total));
        }
      });
    } else {
      this.logger.error('Trying to upload an empty file');
    }
  }

  /**
   * Cancel the image upload currently in progress.
   */
  cancelUpload() {
    this.logger.debug(`PaymentUploadProofComponent::cancelUpload()`);
    this.uploadSub?.unsubscribe();
    this.reset();
  }

  /**
   * Reset the component.
   * This method works for both successful and failed upload attempts.
   */
  reset() {
    this.logger.debug(`PaymentUploadProofComponent::reset()`);
    this.uploadProgress = null;
    this.uploadSub = null;
    this.paymentService.fetchFromServer();
    this.paymentService.fetchPaymentProofs();
    this.file = null;
    this.imgSrc = null;
  }
}
