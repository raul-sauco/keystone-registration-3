import { Component, OnInit } from '@angular/core';
import { FaqService } from 'src/app/services/faq/faq.service';
import { NGXLogger } from 'ngx-logger';
import { RouteStateService } from 'src/app/services/route-state/route-state.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { Faq } from 'src/app/models/faq';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

  tripId: string = null;
  faq$: Observable<Faq[]>;

  constructor(
    private faqService: FaqService,
    private logger: NGXLogger,
    private routeStateService: RouteStateService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.logger.debug('FaqComponent OnInit');

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
        this.faq$ = this.faqService.fetchFaq(tripId);
      }
    });
  }

}
