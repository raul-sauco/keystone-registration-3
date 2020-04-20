import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { GuideService } from 'src/app/services/guide/guide.service';
import { NGXLogger } from 'ngx-logger';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouteStateService } from 'src/app/services/route-state/route-state.service';
import { GlobalsService } from 'src/app/local/globals.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-guides',
  templateUrl: './guides.component.html',
  styleUrls: ['./guides.component.scss']
})
export class GuidesComponent implements OnInit, OnDestroy {

  guide$: Observable<any>;
  tripId: string = null;
  url: string;
  lang: string;

  constructor(
    private guideService: GuideService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private routeStateService: RouteStateService,
    private logger: NGXLogger,
    private translate: TranslateService,
    globals: GlobalsService
  ) {
    this.url = globals.getResUrl();
    this.lang = this.translate.currentLang;
  }

  ngOnInit(): void {

    this.logger.debug('GuidesComponent OnInit');

    this.route.paramMap.subscribe((params: ParamMap) => {

      const tripId = params.get('trip-id');

      if (tripId !== null) {

        this.tripId = tripId;

        this.routeStateService.tripIdParam$.subscribe((id: string) => {
          if (tripId !== id) {
            this.routeStateService.updateTripIdParamState(tripId);
          }
        });

        // TODO get trip id from auth user
        this.guide$ = this.guideService.fetchGuides(tripId);
      }
    });
  }

  /**
   * Clean up
   */
  ngOnDestroy(): void {
    // Nothing to unsubscribe from
  }

}
