import { Component, OnInit } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NGXLogger } from 'ngx-logger';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-covid-policy',
  templateUrl: './covid-policy.component.html',
  styleUrls: ['./covid-policy.component.scss'],
})
export class CovidPolicyComponent implements OnInit {
  content$: Observable<any>;
  lang: string;

  constructor(
    private logger: NGXLogger,
    private api: ApiService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.logger.debug('CovidPolicyComponent OnInit');
    this.lang = this.translate.currentLang.includes('zh') ? 'zh' : 'en';
    const endpoint = 'documents/44';
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    this.content$ = this.api.get(endpoint, null, options);
  }
}
