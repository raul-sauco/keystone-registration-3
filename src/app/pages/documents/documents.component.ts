import { Component, OnInit, inject } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Document } from 'src/app/models/document';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalsService } from 'src/app/services/globals/globals.service';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss'],
  standalone: false
})
export class DocumentsComponent implements OnInit {
  private logger = inject(NGXLogger);
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private globals = inject(GlobalsService);

  document$!: Observable<any>;
  isGuest = false;
  url!: string;

  ngOnInit(): void {
    this.logger.debug('DocumentComponent OnInit');
    this.url = this.globals.getResUrl();
    if (this.auth.authenticated) {
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
    this.document$ = this.api
      .get(endpoint, null)
      .pipe(
        map((docs: any) => docs.map((docJson: any) => new Document(docJson)))
      );
  }
}
