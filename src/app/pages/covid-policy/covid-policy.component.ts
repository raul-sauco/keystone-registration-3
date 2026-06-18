import { ChangeDetectionStrategy, Component } from '@angular/core';

import { KaMdDocumentComponent } from '@components/ka-md-document/ka-md-document.component';

@Component({
  selector: 'app-covid-policy',
  imports: [KaMdDocumentComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '<app-ka-md-document [endpoint]="endpoint"></app-ka-md-document>',
})
export class CovidPolicyComponent {
  endpoint = 'documents/44';
}
