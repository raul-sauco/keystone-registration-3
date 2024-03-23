import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { Subscription } from 'rxjs';

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Student } from '@models/student';
import { ApiService } from '@services/api/api.service';
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
export class IdPhotoComponent implements OnInit {
  @Input() student!: Student;
  @Output() idUploadedEvent = new EventEmitter<boolean>();
  file: File | null = null;
  imgSrc: string | ArrayBuffer | null = null;
  uploadSub: Subscription | null = null;
  urlPrefix!: string;
  images: string[] = [];

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private http: HttpClient,
    private globals: GlobalsService,
    private logger: NGXLogger,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.urlPrefix = `${this.globals.getResUrl()}img/trip/pop/${this.student.id}/`;
    this.api.get('student-id-photos').subscribe({
      next: (res: any) => {
        this.logger.debug(
          `IDPhotoComponent fetched ${res.length} id images from server`,
        );
        this.images = res.map((name: any) => this.urlPrefix + name);
        if (this.images.length > 0) {
          this.idUploadedEvent.emit(true);
        }
      },
    });
  }

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
      const upload$ = this.http.post(url, formData, {
        headers,
      });
      this.uploadSub = upload$.subscribe({
        next: (res: any) => {
          this.logger.debug(
            'IDPhotoComponent::uploadFile upload completed',
            res,
          );
          this.images.push(this.urlPrefix + res.name);
          this.idUploadedEvent.emit(true);
          this.reset();
        },
        error: (err: any) => {
          this.snackBar.open(err, undefined, { duration: 3000 });
          this.reset();
        },
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
    this.uploadSub = null;
    this.file = null;
    this.imgSrc = null;
  }
}
