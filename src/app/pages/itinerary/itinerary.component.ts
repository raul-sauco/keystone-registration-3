import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ActivityGroup } from 'src/app/models/activityGroup';
import { ActivityGroupService } from 'src/app/services/activity-group/activity-group.service';

@Component({
  selector: 'app-itinerary',
  templateUrl: './itinerary.component.html',
  styleUrls: ['./itinerary.component.scss']
})
export class ItineraryComponent implements OnInit, OnDestroy {

  /** used by the template to iterate a collection */
  objectKeys = Object.keys;
  activityGroups: ActivityGroup[] = null;
  private activityGroup$;

  constructor(
    private activityGroupService: ActivityGroupService,
    private route: ActivatedRoute
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
    this.route.paramMap.subscribe(
      async (params: ParamMap) => {
        this.activityGroupService.fetchActivityGroups(params.get('trip-id'));
        this.activityGroup$ = this.activityGroupService
          .activityGroup$.subscribe(resp => {
            this.activityGroups = resp;
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
