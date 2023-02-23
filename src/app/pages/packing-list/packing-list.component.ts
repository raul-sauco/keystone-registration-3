import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { TripPackingListItem } from 'src/app/models/tripPackingListItem';
import { AuthService } from 'src/app/services/auth/auth.service';
import { PackingListService } from 'src/app/services/packing-list/packing-list.service';
import { RouteStateService } from 'src/app/services/route-state/route-state.service';
import { TripSwitcherService } from 'src/app/services/trip-switcher/trip-switcher.service';

@Component({
  selector: 'app-packing-list',
  templateUrl: './packing-list.component.html',
  styleUrls: ['./packing-list.component.scss'],
})
export class PackingListComponent implements OnInit, OnDestroy {
  itemsBring: TripPackingListItem[] = [];
  itemsOptional: TripPackingListItem[] = [];
  itemsDoNotBring: TripPackingListItem[] = [];
  needsLogin = false;
  fetching = false;

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private packingListService: PackingListService,
    private logger: NGXLogger,
    private routeStateService: RouteStateService,
    private tripSwitcher: TripSwitcherService,
    public sanitizer: DomSanitizer
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
            if (this.auth.isSchoolAdmin) {
              if (this.tripSwitcher.selectedTrip) {
                this.fetch(`${this.tripSwitcher.selectedTrip.id}`);
              }
              // Nothing to do for school admins that haven't selected a trip.
            } else {
              this.fetch();
            }
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
    this.fetching = true;
    this.packingListService.fetchItems(tripId);
    this.subscribe();
  }

  /**
   * Subscribe to the service
   */
  subscribe(): void {
    // Subscribe to the service observable
    this.packingListService.item$.subscribe({
      next: (items: TripPackingListItem[]) => {
        this.logger.debug(`Got ${items.length} items from the service`);
        this.fetching = false;

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
                (a.getOrder() || 0) - (b.getOrder() || 0)
            );
          }
        );
      },
      error: (err: string) => {
        this.logger.error(`Error fetching packing list items`, err);
      },
    });
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
