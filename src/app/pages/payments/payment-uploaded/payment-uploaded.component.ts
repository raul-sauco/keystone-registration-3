import { GlobalsService } from 'src/app/services/globals/globals.service';
import { NGXLogger } from 'ngx-logger';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ApiService } from 'src/app/services/api/api.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-payment-uploaded',
  templateUrl: './payment-uploaded.component.html',
  styleUrls: ['./payment-uploaded.component.scss'],
})
export class PaymentUploadedComponent implements OnInit {
  images$!: Observable<any>;
  staticUrl: string;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private logger: NGXLogger,
    globals: GlobalsService
  ) {
    this.staticUrl =
      globals.getResUrl() +
      'img/trip/pop/' +
      this.auth.getCredentials()?.studentId +
      '/';
  }

  ngOnInit(): void {
    this.logger.debug('PaymentUploadedComponent on init');
    this.fetchImages();
  }

  fetchImages() {
    const endpoint = 'trip-direct-payment-proof';
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: ' Bearer ' + this.auth.getCredentials()?.accessToken,
      }),
    };
    this.images$ = this.api.get(endpoint, null, options);
  }
}
