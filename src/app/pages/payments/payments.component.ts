import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss'],
})
export class PaymentsComponent implements OnInit {
  lang!: string;
  content$!: Observable<any>;

  constructor(public auth: AuthService, private logger: NGXLogger) {}

  ngOnInit(): void {
    this.logger.debug('PaymentsComponent OnInit');
  }
}
