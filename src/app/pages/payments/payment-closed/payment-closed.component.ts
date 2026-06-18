import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-payment-closed',
  templateUrl: './payment-closed.component.html',
  styleUrls: ['./payment-closed.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [TranslatePipe],
})
export class PaymentClosedComponent {}
