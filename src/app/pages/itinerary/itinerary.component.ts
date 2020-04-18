import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ActivityGroup } from 'src/app/models/activityGroup';
import { ActivityGroupService } from 'src/app/services/activity-group/activity-group.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouteStateService } from 'src/app/services/routeState/route-state.service';

@Component({
  selector: 'app-itinerary',
  templateUrl: './itinerary.component.html',
  styleUrls: ['./itinerary.component.scss']
})
export class ItineraryComponent implements OnInit, OnDestroy {

  /** used by the template to iterate a collection */
  activityGroups: ActivityGroup[] = null;
  private activityGroup$;

  constructor(
    private activityGroupService: ActivityGroupService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private routeStateService: RouteStateService
  ) { }

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
    this.route.paramMap.subscribe( (params: ParamMap) => {

      // Ask ActivityGroupService to fetch data
      const tripId = params.get('trip-id');

      if (tripId !== null) {
        this.routeStateService.updateTripIdParamState(tripId);
      }

      this.activityGroupService.fetchActivityGroups(tripId);

      // Subscribe to the ActivityGroupService Subject
      this.activityGroup$ = this.activityGroupService
          .activityGroup$.subscribe(resp => {
            this.activityGroups = resp;
          },
          (err: string) => {

            // Notify the user of the error
            const snackBarRef = this.snackBar.open(err, 'Retry', {
              duration: 5000
            });

            snackBarRef.onAction().subscribe(() => {
              this.activityGroupService.fetchActivityGroups(tripId);
            });
          });
      }
    );
  }

  /**
   * Unsubscribe from all active observable subscriptions.
   */
  ngOnDestroy(): void {
    this.activityGroup$.unsubscribe();
  }

}
