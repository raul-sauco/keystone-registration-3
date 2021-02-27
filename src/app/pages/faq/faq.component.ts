import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { RouteStateService } from 'src/app/services/route-state/route-state.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
})
export class FaqComponent implements OnInit {
  packingListLink: string;
  documentPageLink: string;

  constructor(
    private logger: NGXLogger,
    private routeStateService: RouteStateService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.logger.debug('FaqComponent OnInit');
    const headers: any = { 'Content-Type': 'application/json' };
    this.route.paramMap.subscribe((params: ParamMap) => {
      const tripId = params.get('trip-id');
      if (tripId !== null) {
        if (this.routeStateService.getTripId() !== tripId) {
          this.routeStateService.updateTripIdParamState(tripId);
        }
        this.packingListLink = `/packing-list/${tripId}`;
        this.documentPageLink = `/documents/${tripId}`;
      } else {
        this.packingListLink = '/packing-list';
        this.documentPageLink = '/documents';
      }
    });
  }
}
