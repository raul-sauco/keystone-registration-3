import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { Subscription, finalize } from 'rxjs';

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Student } from '@models/student';
import { AuthService } from '@services/auth/auth.service';
import { GlobalsService } from '@services/globals/globals.service';

@Component({
  selector: 'app-id-photo',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    TranslateModule,
  ],
  templateUrl: './id-photo.component.html',
  styleUrl: './id-photo.component.scss',
})
export class IdPhotoComponent {
  @Input() student!: Student;
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
    private snackBar: MatSnackBar,
    private translate: TranslateService,
  ) {}

  /**
   * Handle the user selecting a file.
   * It
   * @param event
   */
  onFileSelected(event: any) {
    this.logger.debug('IDPhotoComponent::onFileSelected(event)');
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
    this.logger.debug('IDPhotoComponent::uploadFile()');
    if (this.file) {
      const formData = new FormData();
      const url = this.globals.getApiUrl() + 'student-id-photos';
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
          }),
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
   * Reset the component.
   * This method works for both successful and failed upload attempts.
   */
  reset() {
    this.logger.debug(`IDPhotoComponent::reset()`);
    this.uploadProgress = null;
    this.uploadSub = null;
    this.file = null;
    this.imgSrc = null;
  }
}
