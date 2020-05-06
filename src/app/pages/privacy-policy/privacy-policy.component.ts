import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { NGXLogger } from 'ngx-logger';
import { ApiService } from 'src/app/services/api/api.service';
import { HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {
  content$: Observable<any>;
  lang: string;

  constructor(
    private logger: NGXLogger,
    private api: ApiService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.logger.debug('PrivacyPolicyComponent OnInit');
    this.lang = this.translate.currentLang.includes('zh') ? 'zh' : 'en';
    const endpoint = 'documents/2';
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // Authorization: ' Bearer ' + this.auth.getCredentials().accessToken,
      }),
    };
    this.content$ = this.api.get(endpoint, null, options);
  }
}
