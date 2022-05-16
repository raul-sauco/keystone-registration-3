import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalsService } from 'src/app/services/globals/globals.service';

@Component({
  selector: 'app-health-codes',
  templateUrl: './health-codes.component.html',
  styleUrls: ['./health-codes.component.scss'],
})
export class HealthCodesComponent implements OnInit {
  lang!: string;
  content$!: Observable<any>;
  staticUrl: string;

  constructor(
    private logger: NGXLogger,
    public auth: AuthService,
    globals: GlobalsService
  ) {
    this.staticUrl = globals.getResUrl();
  }

  ngOnInit(): void {
    this.logger.debug('HealthCodesComponent OnInit');
  }
}
