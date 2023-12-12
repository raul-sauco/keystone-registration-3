import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { Observable, map } from 'rxjs';

import { ApiService } from '@services/api/api.service';
import { RouteStateService } from '@services/route-state/route-state.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FaqComponent implements OnInit {
  content$!: Observable<string>;

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
    const endpoint = 'documents/48';
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    this.content$ = this.api
      .get(endpoint, null, options)
      .pipe(
        map((doc: any) =>
          this.translate.currentLang.includes('zh') ? doc.text_zh : doc.text
        )
      );
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
