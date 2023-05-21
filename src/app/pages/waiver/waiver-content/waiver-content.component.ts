import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';

import { HttpHeaders } from '@angular/common/http';
import { ApiService } from '@services/api/api.service';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-waiver-content',
  templateUrl: './waiver-content.component.html',
  styleUrls: ['./waiver-content.component.scss'],
})
export class WaiverContentComponent implements OnInit {
  content$!: Observable<any>;

  constructor(
    private logger: NGXLogger,
    public api: ApiService,
    public translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.logger.debug('WaiverContentComponent OnInit');
    this.fetchContents();
  }
  /**
   * Fetch content that needs to be displayed in the UI.
   */
  fetchContents() {
    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    this.content$ = this.api.get('documents/75', null, options);
  }
}
