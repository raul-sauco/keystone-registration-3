import { catchError } from 'rxjs/operators';
import {
  HttpHeaders,
  HttpClient,
  HttpEventType,
  HttpErrorResponse,
} from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { finalize, Subscription, throwError } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalsService } from 'src/app/services/globals/globals.service';

@Component({
  selector: 'app-health-codes',
  templateUrl: './health-codes.component.html',
  styleUrls: ['./health-codes.component.scss'],
})
export class HealthCodesComponent implements OnInit, OnDestroy {
  file: File | null = null;
  imgSrc: string | ArrayBuffer | null = null;
  uploadProgress: number | null = null;
  uploadSub: Subscription | null = null;
  success = false;
  lang!: string;
  staticUrl: string;

  constructor(
    private auth: AuthService,
    private globals: GlobalsService,
    private http: HttpClient,
    private logger: NGXLogger,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {
    this.staticUrl = globals.getResUrl();
  }

  ngOnDestroy(): void {
    this.uploadSub?.unsubscribe();
  }

  ngOnInit(): void {
    this.logger.debug('HealthCodesComponent OnInit');
  }

  onFileSelected(event: any): void {
    this.logger.debug('File selected');
    this.file = event.target.files[0];
    if (this.file) {
      // const reader = new FileReader();
      // reader.onload = (_) => (this.imgSrc = reader.result);
      // reader.readAsDataURL(this.file);
      this.uploadFile();
    } else {
      this.snackBar.open(this.translate.instant('SELECT_VALID_FILE'));
    }
  }

  uploadFile(): void {
    if (this.file) {
      this.logger.debug('Uploading file');
      const formData = new FormData();
      const url = this.globals.getApiUrl() + 'student-images';
      const headers = new HttpHeaders({
        // 'Content-Type': Automatically assigned by the browser when it detects form data.
        Authorization: ' Bearer ' + this.auth.getCredentials()?.accessToken,
      });
      formData.append('image', this.file);
      // StudentImage type 2 is a health code image.
      formData.append('type', '2');
      const upload$ = this.http
        .post(url, formData, {
          headers,
          reportProgress: true,
          observe: 'events',
        })
        .pipe(
          finalize(() => {
            this.logger.debug('Upload successful');
            this.success = true;
            this.reset();
          }),
          catchError((error: HttpErrorResponse) => {
            const message = 'The upload file request encountered an error';
            this.snackBar.open(
              this.translate.instant('SERVER_ERROR_TRY_LATER'),
              this.translate.instant('OK')
            );
            this.logger.error(message);
            return throwError(() => new Error(message));
          })
        );
      this.uploadSub = upload$.subscribe((event) => {
        if (event.type == HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round(100 * (event.loaded / event.total));
        }
      });
    } else {
      this.logger.error('Trying to upload an empty file');
      this.snackBar.open(this.translate.instant('SERVER_ERROR_TRY_LATER'));
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
    this.file = null;
    this.imgSrc = null;
  }
}
