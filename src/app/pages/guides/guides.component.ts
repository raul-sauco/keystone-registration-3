import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatCard, MatCardContent, MatCardImage, MatCardSubtitle } from '@angular/material/card';
import { TranslatePipe } from '@ngx-translate/core';

import { LocalizationService } from '@app/services/localization/localization.service';
import { LoadingSpinnerContentComponent } from '@components/loading-spinner-content/loading-spinner-content.component';
import { GlobalsService } from '@services/globals/globals.service';
import { GuidesService } from '@services/guides/guides.service';
import { TripService } from '@services/trip/trip.service';

@Component({
  selector: 'app-guides',
  templateUrl: './guides.component.html',
  styleUrls: ['./guides.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCard,
    MatCardImage,
    MatCardContent,
    MatCardSubtitle,
    LoadingSpinnerContentComponent,
    TranslatePipe,
  ],
})
export class GuidesComponent {
  private readonly globals = inject(GlobalsService);
  private readonly localization = inject(LocalizationService);
  private readonly tripService = inject(TripService);
  private readonly guidesService = inject(GuidesService);

  readonly guides = this.guidesService.guides;
  readonly isStaffingConfirmed = this.tripService.trip()?.isStaffingConfirmed;
  readonly language = this.localization.currentLanguage;
  readonly url = this.globals.getResUrl();

  readonly isLoading = computed(
    () =>
      this.tripService.tripResource.isLoading() || this.guidesService.guidesResource.isLoading(),
  );
}
