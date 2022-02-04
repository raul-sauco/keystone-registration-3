import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { finalize, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalsService } from 'src/app/services/globals/globals.service';

@Component({
  selector: 'app-payment-upload-proof',
  templateUrl: './payment-upload-proof.component.html',
  styleUrls: ['./payment-upload-proof.component.scss'],
})
export class PaymentUploadProofComponent implements OnInit {
  fileName = '';
  uploadProgress: number | null = null;
  uploadSub: Subscription | null = null;

  constructor(
    private auth: AuthService,
    private http: HttpClient,
    private globals: GlobalsService,
    private logger: NGXLogger
  ) {}

  ngOnInit(): void {
    this.logger.debug('PaymentUploadProofComponent on init');
  }

  // https://blog.angular-university.io/angular-file-upload/
  onFileSelected(event: any) {
    this.logger.debug('File Selected');
    const file: File = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      const formData = new FormData();
      const url = this.globals.getApiUrl() + 'trip-direct-payment-proof';
      console.log('posting to ' + url);
      const headers = new HttpHeaders({
        // 'Content-Type': Automatically assigned by the browser when it detects form data.
        Authorization: ' Bearer ' + this.auth.getCredentials()?.accessToken,
      });
      formData.append('image', file);
      const upload$ = this.http
        .post(url, formData, {
          headers,
          reportProgress: true,
          observe: 'events',
        })
        .pipe(finalize(() => this.reset()));

      this.uploadSub = upload$.subscribe((event) => {
        if (event.type == HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round(100 * (event.loaded / event.total));
        }
      });
    }
  }

  cancelUpload() {
    this.uploadSub?.unsubscribe();
    this.reset();
  }

  reset() {
    this.uploadProgress = null;
    this.uploadSub = null;
  }
}
