import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { PackingListService } from 'src/app/services/packing-list/packing-list.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouteStateService } from 'src/app/services/route-state/route-state.service';
import { NGXLogger } from 'ngx-logger';
import { TripPackingListItem } from 'src/app/models/tripPackingListItem';

@Component({
  selector: 'app-packing-list',
  templateUrl: './packing-list.component.html',
  styleUrls: ['./packing-list.component.scss']
})
export class PackingListComponent implements OnInit, OnDestroy {

  itemsBring: TripPackingListItem[] = [];
  itemsOptional: TripPackingListItem[] = [];
  itemsDoNotBring: TripPackingListItem[] = [];
  tripId: string = null;

  constructor(
    private packingListService: PackingListService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private routeStateService: RouteStateService,
    private logger: NGXLogger
  ) { }

  ngOnInit(): void {

    this.logger.debug('PackingList ngOnInit called');

    // Try to find a trip-id parameter
    this.route.paramMap.subscribe((params: ParamMap) => {

      const tripId = params.get('trip-id');

      if (tripId !== null) {

        this.tripId = tripId;

        this.routeStateService.tripIdParam$.subscribe((id: string) => {

          // If trip-ids are different update them
          if (tripId !== id) {

            this.routeStateService.updateTripIdParamState(tripId);

          }
        });

        this.packingListService.fetchItems(tripId);

      } else {

        // TODO if user is authenticated, fetch for their trip
        // Currently we need a trip-id parameter
        this.snackBar.open('No trip selected', 'Got it');
        this.logger.warn('PackingListComponent; missing trip-id parameter');

      }


    });

    // Subscribe to the service observable
    this.packingListService.item$.subscribe(
      (items: TripPackingListItem[]) => {

        // Assign the items to the corresponding properties
        items.forEach((i: TripPackingListItem) => {
          switch (i.getBring()) {
            case 0:
              this.itemsBring.push(i);
              break;
            case 1:
              this.itemsOptional.push(i);
              break;
            case 2:
              this.itemsDoNotBring.push(i);
              break;
            default:
              this.logger.warn(`PLI bring ${i.getBring()} is not valid;`, i);
              break;
          }
        });

        // Sort the arrays by the item's order property
        [
          this.itemsBring,
          this.itemsOptional,
          this.itemsDoNotBring
        ].forEach((array: TripPackingListItem[]) => {
          array.sort((a: TripPackingListItem, b: TripPackingListItem) =>
            a.getOrder() - b.getOrder());
        });

      }, (err: string) => {

        const snackBarRef = this.snackBar.open(err, 'Retry');

        snackBarRef.onAction().subscribe(() => {
          this.packingListService.fetchItems(this.tripId);
        });
      }
    );
  }

  /**
   * Clean up
   */
  ngOnDestroy() {

    this.logger.debug('PackingList ngOnDestroy called');
    /*
     * TODO unsubscribing from the Subject throws error if
     * we try to subscribe back on the next ngOnInit call
     */
    // this.packingListService.item$.unsubscribe();
  }

}
