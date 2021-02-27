import { ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { GlobalsService } from 'src/app/local/globals.service';
import { RouteStateService } from 'src/app/services/route-state/route-state.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  url: string;
  columns = 1;

  cards = [
    {
      title: 'HOME_CARD_TITLE_ABOUT',
      content: 'HOME_CARD_CONTENT_ABOUT',
      image: 'KJ3M1ODBSAFMVEB8KPID.jpg',
    },
    {
      title: 'HOME_CARD_TITLE_MISSION',
      content: 'HOME_CARD_CONTENT_MISSION',
      image: 'PC4XLG7D7G8WVECMVDTO.jpg',
    },
    {
      title: 'HOME_CARD_TITLE_SAFETY_FIRST_AID',
      content: 'HOME_CARD_CONTENT_SAFETY_FIRST_AID',
      image: '4F1Y03I7SNQVNZKXF67G.jpg',
    },
    {
      title: 'HOME_CARD_TITLE_STAFF',
      content: 'HOME_CARD_CONTENT_STAFF',
      image: 'XIS486MWGCBKLQ20HAO1.jpg',
    },
    {
      title: 'HOME_CARD_TITLE_RISK_MANAGEMENT',
      content: 'HOME_CARD_CONTENT_RISK_MANAGEMENT',
      image: 'Y8P3HCWWB7VOY21UYVBK.jpg',
    },
    {
      title: 'HOME_CARD_TITLE_EMERGENCY_PROCEDURES',
      content: 'HOME_CARD_CONTENT_EMERGENCY_PROCEDURES',
      image: 'QV2G16I1OFGL23JSOFZM.webp',
    },
    {
      title: 'HOME_CARD_TITLE_BACKUP_PLANS',
      content: 'HOME_CARD_CONTENT_BACKUP_PLANS',
      image: 'FTBR4BCVJVHQ754O4CDD.jpg',
    },
    {
      title: 'HOME_CARD_TITLE_EQUIPMENT',
      content: 'HOME_CARD_CONTENT_EQUIPMENT',
      image: 'HI4D3G46YKJMNUBV7SMI.jpg',
    },
    {
      title: 'HOME_CARD_TITLE_MEALS',
      content: 'HOME_CARD_CONTENT_MEALS',
      image: 'Z0TP2KIC99SHR8TYSLJJ.png',
    },
    {
      title: 'HOME_CARD_TITLE_ACCOMMODATION',
      content: 'HOME_CARD_CONTENT_ACCOMMODATION',
      image: 'MRBDL3Y3TTDEHK4RKLJE.jpg',
    },
    {
      title: 'HOME_CARD_TITLE_TRANSPORTATION',
      content: 'HOME_CARD_CONTENT_TRANSPORTATION',
      image: '5HPQYJ6QTC3UG23WGITX.jpg',
    },
    {
      title: 'HOME_CARD_TITLE_INSURANCE',
      content: 'HOME_CARD_CONTENT_INSURANCE',
      image: 'Y8NUMCWKUDIMMPJJCCOM.jpg',
    },
  ];

  constructor(
    globals: GlobalsService,
    private route: ActivatedRoute,
    private routeStateService: RouteStateService
  ) {
    this.url = globals.getResUrl() + 'img/portal/';
  }

  /**
   * Initialize the component.
   */
  ngOnInit() {
    this.columns = this.calculateColumns(window.innerWidth);
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

  onResize(event) {
    this.columns = this.calculateColumns(event.target.innerWidth);
  }

  /**
   * Calculate the number of columns that the grid should have
   * based on the container's width.
   *
   * @param width The width of the container
   */
  calculateColumns(width: number) {
    if (width < 768) {
      return 1;
    }
    if (width < 1200) {
      return 2;
    }
    return 3;
  }
}
