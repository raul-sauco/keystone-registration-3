import { AsyncPipe } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import {  Component, OnInit, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';

import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalsService } from 'src/app/services/globals/globals.service';
import { RouteStateService } from 'src/app/services/route-state/route-state.service';
import { LoadingSpinnerContentComponent } from '../../components/loading-spinner-content/loading-spinner-content.component';
import { LoginRequiredMessageComponent } from '../../components/login-required-message/login-required-message.component';
import { NoResultsComponent } from '../../components/no-results/no-results.component';

@Component({
  selector: 'app-program-overview',
  templateUrl: './program-overview.component.html',
  styleUrls: ['./program-overview.component.scss'],
  imports: [
    LoginRequiredMessageComponent,
    MatIcon,
    NoResultsComponent,
    LoadingSpinnerContentComponent,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class ProgramOverviewComponent implements OnInit {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private globals = inject(GlobalsService);
  private logger = inject(NGXLogger);
  private route = inject(ActivatedRoute);
  private routeStateService = inject(RouteStateService);
  private translate = inject(TranslateService);

  document$: Observable<any> | null = null;
  url: string;
  lang: string;
  needsLogin = false;

  constructor() {
    this.url = this.globals.getResUrl();
    this.lang = this.translate.getCurrentLang();
  }

  ngOnInit(): void {
    this.logger.debug('ProgramOverviewComponent OnInit');
    this.route.paramMap.subscribe((params: ParamMap) => {
      const tripId = params.get('trip-id');
      if (tripId !== null) {
        // If we have a routing parameter, update the route state and fetch data
        if (this.routeStateService.getTripId() !== tripId) {
          this.routeStateService.updateTripIdParamState(tripId);
        }
        this.fetchPdfData(tripId);
      } else {
        // No trip id router parameter
        this.auth.checkAuthenticated().then((res: boolean) => {
          if (res) {
            this.fetchPdfData();
          } else {
            // We are not fetching anything, inform the user
            this.needsLogin = true;
          }
        });
      }
    });
  }

  fetchPdfData(tripId?: string): void {
    const endpoint = 'files?tagged=itinerary' + (tripId ? `&trip-id=${tripId}` : '');
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (this.auth.getAccessToken()) {
      headers = headers.append('Authorization', `Bearer ${this.auth.getAccessToken()}`);
    }
    const options = { headers };
    this.document$ = this.api.get(endpoint, null, options);
  }
}
