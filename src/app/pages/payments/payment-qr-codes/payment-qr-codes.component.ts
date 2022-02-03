import { GlobalsService } from './../../../services/globals/globals.service';
import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-payment-qr-codes',
  templateUrl: './payment-qr-codes.component.html',
  styleUrls: ['./payment-qr-codes.component.scss'],
})
export class PaymentQrCodesComponent implements OnInit {
  images$!: Observable<any>;
  staticUrl: string;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private logger: NGXLogger,
    globals: GlobalsService
  ) {
    this.staticUrl = globals.getResUrl();
  }

  ngOnInit(): void {
    this.logger.debug('PaymentQrCodes on init');
    this.fetchQrCodes();
  }

  fetchQrCodes(): void {
    const endpoint = 'trip-direct-payment-qr-codes';
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: ' Bearer ' + this.auth.getCredentials()?.accessToken,
      }),
    };
    this.images$ = this.api.get(endpoint, null, options);
  }
}
