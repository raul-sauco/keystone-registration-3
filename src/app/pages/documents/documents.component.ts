import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { NGXLogger } from 'ngx-logger';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { HttpHeaders } from '@angular/common/http';
import { GlobalsService } from 'src/app/services/globals/globals.service';
import { map } from 'rxjs/operators';
import { Document } from 'src/app/models/document';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {
  document$: Observable<any>;
  isGuest = false;
  url: string;

  constructor(
    private logger: NGXLogger,
    private api: ApiService,
    private auth: AuthService,
    private globals: GlobalsService
  ) { }

  ngOnInit(): void {
    this.logger.debug('DocumentComponent OnInit');
    this.url = this.globals.getResUrl();
    if (
      this.auth.authenticated &&
      this.auth.getCredentials().accessToken
    ) {
      this.fetch();
    } else {
      // Also check async
      this.auth.checkAuthenticated().then((res: boolean) => {
        if (res) {
          this.fetch();
        } else {
          this.isGuest = true;
        }
      });
    }
  }

  fetch() {
    this.logger.debug('DocumentComponent fetch() called');
    const endpoint = 'files';
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: ' Bearer ' + this.auth.getCredentials().accessToken,
      }),
    };
    this.document$ = this.api.get(endpoint, null, options).pipe(
      map((docs: any) => docs.map((docJson: any) => new Document(docJson)))
    );
  }
}
