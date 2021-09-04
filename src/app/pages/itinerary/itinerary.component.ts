import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ActivityGroup } from 'src/app/models/activityGroup';
import { ActivityGroupService } from 'src/app/services/activity-group/activity-group.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { RouteStateService } from 'src/app/services/route-state/route-state.service';

@Component({
  selector: 'app-itinerary',
  templateUrl: './itinerary.component.html',
  styleUrls: ['./itinerary.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ItineraryComponent implements OnInit {
  /** used by the template to iterate a collection */
  activityGroups: ActivityGroup[] = null;
  needsLogin = false;

  constructor(
    private activityGroupService: ActivityGroupService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private routeStateService: RouteStateService,
    private auth: AuthService
  ) {}

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
    // Try to find a trip ID parameter
    this.route.paramMap.subscribe((params: ParamMap) => {
      const tripId = params.get('trip-id');
      if (tripId !== null) {
        // If we have a routing parameter, update the route state and fetch data
        if (this.routeStateService.getTripId() !== tripId) {
          this.routeStateService.updateTripIdParamState(tripId);
        }
        this.fetch(tripId);
      } else {
        // No trip id router parameter
        this.auth.checkAuthenticated().then((res: boolean) => {
          if (res) {
            // Fetch data using access_token
            this.fetch();
          } else {
            // We are not fetching anything, inform the user
            this.needsLogin = true;
          }
        });
      }
    });
  }

  fetch(tripId?: string): void {
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
