import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { finalize, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalsService } from 'src/app/services/globals/globals.service';
import { PaymentService } from 'src/app/services/payment/payment.service';

@Component({
  selector: 'app-payment-upload-proof',
  templateUrl: './payment-upload-proof.component.html',
  styleUrls: ['./payment-upload-proof.component.scss'],
})
export class PaymentUploadProofComponent implements OnInit {
  file: File | null = null;
  imgSrc: string | ArrayBuffer | null = null;
  uploadProgress: number | null = null;
  uploadSub: Subscription | null = null;
  success = false;

  constructor(
    private auth: AuthService,
    private http: HttpClient,
    private globals: GlobalsService,
    private logger: NGXLogger,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.logger.debug('PaymentUploadProofComponent on init');
  }

  /**
   * Handle the user selecting a file.
   * It stores the file to allow uploading to the server and it displays a
   * preview on the component.
   * @param event
   */
  onFileSelected(event: any) {
    this.logger.debug('File Selected');
    this.file = event.target.files[0];
    if (this.file) {
      const reader = new FileReader();
      reader.onload = (_) => (this.imgSrc = reader.result);
      reader.readAsDataURL(this.file);
    } else {
      // TODO warn the user that the file is empty.
    }
  }

  /**
   * Handle uploading the stored file to the server.
   */
  uploadFile(): void {
    if (this.file) {
      const formData = new FormData();
      const url = this.globals.getApiUrl() + 'trip-direct-payment-proof';
      const headers = new HttpHeaders({
        // 'Content-Type': Automatically assigned by the browser when it detects form data.
        Authorization: ' Bearer ' + this.auth.getCredentials()?.accessToken,
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
    this.uploadSub?.unsubscribe();
    this.reset();
  }

  /**
   * Reset the component.
   * This method works for both successful and failed upload attempts.
   */
  reset() {
    this.uploadProgress = null;
    this.uploadSub = null;
    this.paymentService.fetchFromServer();
    this.paymentService.fetchPaymentProofs();
    this.file = null;
    this.imgSrc = null;
  }
}
