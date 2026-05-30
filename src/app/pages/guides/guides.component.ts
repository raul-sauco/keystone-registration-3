import { AsyncPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatCard, MatCardContent, MatCardImage, MatCardSubtitle } from '@angular/material/card';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { AdminBannerComponent } from '@components/admin-banner/admin-banner.component';
import { LoadingSpinnerContentComponent } from '@components/loading-spinner-content/loading-spinner-content.component';
import { LoginRequiredMessageComponent } from '@components/login-required-message/login-required-message.component';
import { Guide } from '@models/guide';
import { ApiService } from '@services/api/api.service';
import { AuthService } from '@services/auth/auth.service';
import { GlobalsService } from '@services/globals/globals.service';
import { TripService } from '@services/trip/trip.service';

@Component({
  selector: 'app-guides',
  templateUrl: './guides.component.html',
  styleUrls: ['./guides.component.scss'],
  imports: [
    LoginRequiredMessageComponent,
    AdminBannerComponent,
    MatCard,
    MatCardImage,
    MatCardContent,
    MatCardSubtitle,
    LoadingSpinnerContentComponent,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class GuidesComponent implements OnInit {
  private auth = inject(AuthService);
  private api = inject(ApiService);
  private logger = inject(NGXLogger);
  private translate = inject(TranslateService);
  private tripService = inject(TripService);

  guide$: Observable<Guide[]> = of([]);
  url: string;
  lang: string;
  needsLogin = false;
  displayStaffingNotConfirmedTemplate = true;

  constructor() {
    const globals = inject(GlobalsService);

    this.url = globals.getResUrl();
    this.lang = this.translate.getCurrentLang();
  }

  ngOnInit(): void {
    this.logger.debug('GuidesComponent OnInit');
    const trip = this.tripService.trip;
    if (trip !== null) {
      if (trip.isStaffingConfirmed) {
        this.logger.debug(`Trip ${trip.id} staffing confirmed, fetching staff information`);
        this.displayStaffingNotConfirmedTemplate = false;
        this.fetch();
      } else {
        // Fetch template content.
      }
    } else {
      // If we don't have a trip id parameter, request for the current user
      this.auth.checkAuthenticated().then((res: boolean) => {
        if (res && this.auth.getAccessToken()) {
          this.fetch();
        } else {
          this.needsLogin = true;
        }
      });
    }
  }

  /**
   * Have the ApiService make a request for guides and
   * subscribe to the result.
   * The request supports authenticated and trip-id trip
   * resolution.
   * @param params parameters to be sent on the request
   * @param headers to be added to the options object
   */
  fetch(): void {
    this.guide$ = this.api.get('guides').pipe(
      map((res: any) => {
        // Sort the guides and map them to Guide models
        return res
          .sort((a: any, b: any) => a.nickname.localeCompare(b.nickname))
          .map((guideJSON: any) => new Guide(guideJSON));
      }),
    );
  }
}
