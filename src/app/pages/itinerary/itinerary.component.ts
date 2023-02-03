import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { ActivityGroup } from 'src/app/models/activityGroup';
import { ActivityGroupService } from 'src/app/services/activity-group/activity-group.service';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalsService } from 'src/app/services/globals/globals.service';
import { RouteStateService } from 'src/app/services/route-state/route-state.service';
import { TripSwitcherService } from 'src/app/services/trip-switcher/trip-switcher.service';

@Component({
  selector: 'app-itinerary',
  templateUrl: './itinerary.component.html',
  styleUrls: ['./itinerary.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ItineraryComponent implements OnInit {
  /** used by the template to iterate a collection */
  activityGroups: ActivityGroup[] | null = null;
  url: string;
  lang: string;
  needsLogin = false;

  constructor(
    private activityGroupService: ActivityGroupService,
    private api: ApiService,
    private auth: AuthService,
    private globals: GlobalsService,
    private logger: NGXLogger,
    private route: ActivatedRoute,
    private routeStateService: RouteStateService,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private tripSwitcher: TripSwitcherService
  ) {
    this.url = this.globals.getResUrl();
    this.lang = this.translate.currentLang;
  }

  /**
   * Try to get an optional trip-id parameter and have the
   * activity group service fetch activity groups for the
   * component.
   *
   * If the component didn't get the parameter, the backend
   * will try to authenticate the user and return activity
   * groups for the trip they are a participant on.
   */
  ngOnInit() {
    this.logger.debug('ItineraryComponent OnInit');
    this.route.paramMap.subscribe((params: ParamMap) => {
      const tripId = params.get('trip-id');
      if (tripId !== null) {
        // If we have a routing parameter, update the route state and fetch data
        if (this.routeStateService.getTripId() !== tripId) {
          this.routeStateService.updateTripIdParamState(tripId);
        }
        this.fetchActivityGroupData(tripId);
      } else {
        // No trip id router parameter
        this.auth.checkAuthenticated().then((res: boolean) => {
          if (res) {
            if (this.auth.isSchoolAdmin) {
              if (this.tripSwitcher.selectedTrip) {
                this.fetchActivityGroupData(
                  `${this.tripSwitcher.selectedTrip.id}`
                );
              } else {
                // If a school admin has not selected a trip, we can't fetch the activity groups
                this.activityGroups = [];
              }
            } else {
              // trip participants can fetch without selecting a trip, the backend determines which trip to fetch
              // they are a participant on given their data.
              this.fetchActivityGroupData();
            }
          } else {
            // We are not fetching anything, inform the user
            this.needsLogin = true;
          }
        });
      }
    });
  }

  fetchActivityGroupData(tripId?: string): void {
    this.activityGroupService.fetchActivityGroups(tripId);

    // Subscribe to the ActivityGroupService Subject
    this.activityGroupService.activityGroup$.subscribe({
      next: (resp) => {
        this.activityGroups = resp;
      },
      error: (err: string) => {
        // Notify the user of the error
        const snackBarRef = this.snackBar.open(err, 'Retry', {
          duration: 5000,
        });
        snackBarRef.onAction().subscribe(() => {
          this.activityGroupService.fetchActivityGroups(tripId);
        });
      },
    });
  }
}
