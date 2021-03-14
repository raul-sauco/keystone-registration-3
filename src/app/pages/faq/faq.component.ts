import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { HttpHeaders } from '@angular/common/http';

import { ApiService } from 'src/app/services/api/api.service';
import { RouteStateService } from 'src/app/services/route-state/route-state.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FaqComponent implements OnInit {
  content$: Observable<any>;
  lang: string;

  constructor(
    private api: ApiService,
    private logger: NGXLogger,
    private routeStateService: RouteStateService,
    private route: ActivatedRoute,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.logger.debug('FaqComponent OnInit');
    this.fetchContent();
    this.checkTripIdParam();
  }

  fetchContent(): void {
    this.lang = this.translate.currentLang.includes('zh') ? 'zh' : 'en';
    const endpoint = 'documents/48';
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    this.content$ = this.api.get(endpoint, null, options);
  }

  /**
   * Check trip ID.
   */
  checkTripIdParam(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const tripId = params.get('trip-id');
      if (tripId !== null && this.routeStateService.getTripId() !== tripId) {
        this.routeStateService.updateTripIdParamState(tripId);
      }
    });
  }
}
