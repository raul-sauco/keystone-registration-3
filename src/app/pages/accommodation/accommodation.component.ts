import { Component, OnInit } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';

import { ApiService } from './../../services/api/api.service';
import { AuthService } from './../../services/auth/auth.service';
import { Supplier } from './../../models/supplier';

@Component({
  selector: 'app-accommodation',
  templateUrl: './accommodation.component.html',
  styleUrls: ['./accommodation.component.scss'],
})
export class AccommodationComponent implements OnInit {
  supplier$: Observable<Supplier>;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private logger: NGXLogger
  ) {}

  ngOnInit(): void {
    this.logger.debug('AccommodationComponent OnInit');
    this.auth.checkAuthenticated().then((res: boolean) => {
      if (res) {
        if (this.auth.getCredentials().accessToken) {
          if (this.auth.getCredentials().studentId) {
            this.fetch();
          } else {
            this.logger.error(
              'Authentication error, expected valid student ID.'
            );
          }
        } else {
          this.logger.error('Authentication error, expected access token.');
        }
      } else {
        this.logger.error('Authentication error, expected having auth info.');
      }
    });
  }

  /**
   * Fetch accommodation info from the backend.
   */
  fetch(): void {
    const endpoint = 'accommodation?expand=images';
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: ' Bearer ' + this.auth.getCredentials().accessToken,
      }),
    };
    this.supplier$ = this.api
      .get(endpoint, null, options)
      .pipe(
        map((res: any) =>
          res.map((supplierJson: any) => new Supplier(supplierJson))
        )
      );
  }
}
