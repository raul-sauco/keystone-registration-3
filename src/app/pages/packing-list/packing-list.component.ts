import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { PackingListService } from 'src/app/services/packing-list/packing-list.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { RouteStateService } from 'src/app/services/route-state/route-state.service';
import { NGXLogger } from 'ngx-logger';
import { TripPackingListItem } from 'src/app/models/tripPackingListItem';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-packing-list',
  templateUrl: './packing-list.component.html',
  styleUrls: ['./packing-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PackingListComponent implements OnInit, OnDestroy {
  itemsBring: TripPackingListItem[] = [];
  itemsOptional: TripPackingListItem[] = [];
  itemsDoNotBring: TripPackingListItem[] = [];
  needsLogin = false;

  constructor(
    private packingListService: PackingListService,
    private route: ActivatedRoute,
    private routeStateService: RouteStateService,
    private logger: NGXLogger,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.logger.debug('PackingList ngOnInit called');
    // Try to find a trip-id parameter
    this.route.paramMap.subscribe((params: ParamMap) => {
      const tripId = params.get('trip-id');
      if (tripId !== null) {
        if (this.routeStateService.getTripId() !== tripId) {
          this.routeStateService.updateTripIdParamState(tripId);
        }
        this.fetch(tripId);
      } else {
        this.auth.checkAuthenticated().then((res: boolean) => {
          if (res) {
            this.fetch();
          } else {
            this.needsLogin = true;
          }
        });
      }
    });
  }

  /**
   * Ask the service to fetch packing list items for the
   * current user's trip. Optionally can pass a tripId
   * parameter to indicate which trip to fetch for
   * @param tripId string the id of the trip to fetch for.
   */
  fetch(tripId?: string): void {
    this.packingListService.fetchItems(tripId);
    this.subscribe();
  }

  /**
   * Subscribe to the service
   */
  subscribe(): void {
    // Subscribe to the service observable
    this.packingListService.item$.subscribe(
      (items: TripPackingListItem[]) => {
        this.logger.debug(`Got ${items.length} items from the service`);

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
        [this.itemsBring, this.itemsOptional, this.itemsDoNotBring].forEach(
          (array: TripPackingListItem[]) => {
            array.sort(
              (a: TripPackingListItem, b: TripPackingListItem) =>
                a.getOrder() - b.getOrder()
            );
          }
        );
      },
      (err: string) => {
        this.logger.error(`Error fetching packing list items`, err);
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
