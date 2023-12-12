import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { Observable, map } from 'rxjs';

import { ApiService } from 'src/app/services/api/api.service';
import { RouteStateService } from 'src/app/services/route-state/route-state.service';

@Component({
  selector: 'app-child-protection',
  templateUrl: './child-protection.component.html',
  styleUrls: ['./child-protection.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChildProtectionComponent implements OnInit {
  content$!: Observable<string>;

  constructor(
    private logger: NGXLogger,
    private api: ApiService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private routeStateService: RouteStateService
  ) {}

  ngOnInit(): void {
    this.logger.debug('ChildProtectionComponent OnInit');
    const endpoint = 'documents/45';
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
    this.checkTripIdParam();
  }

  /**
   * Check the current route for a trip-id parameter and update the
   * route state service if a parameter is found and not the same as trip-id.
   */
  checkTripIdParam() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const tripId = params.get('trip-id');
      if (tripId !== null) {
        if (this.routeStateService.getTripId() !== tripId) {
          this.routeStateService.updateTripIdParamState(tripId);
        }
      }
    });
  }
}
