import { Component, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-payment-closed',
    templateUrl: './payment-closed.component.html',
    styleUrls: ['./payment-closed.component.scss'],
    imports: [TranslatePipe]
})
export class PaymentClosedComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
