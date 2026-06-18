import { ChangeDetectionStrategy, Component } from '@angular/core';

import { KaMdDocumentComponent } from '@components/ka-md-document/ka-md-document.component';
@Component({
  selector: 'app-child-protection',
  imports: [KaMdDocumentComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '<app-ka-md-document [endpoint]="endpoint"></app-ka-md-document>',
})
export class ChildProtectionComponent {
  endpoint = 'documents/45';
}
