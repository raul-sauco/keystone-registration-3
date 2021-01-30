import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NGXLogger } from 'ngx-logger';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-child-protection',
  templateUrl: './child-protection.component.html',
  styleUrls: ['./child-protection.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChildProtectionComponent implements OnInit {
  content$: Observable<any>;
  lang: string;

  constructor(
    private logger: NGXLogger,
    private api: ApiService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.logger.debug('ChildProtectionComponent OnInit');
    this.lang = this.translate.currentLang.includes('zh') ? 'zh' : 'en';
    const endpoint = 'documents/45';
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    this.content$ = this.api.get(endpoint, null, options);
  }
}
