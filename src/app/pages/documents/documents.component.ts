import { Component, OnInit, inject } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Document } from 'src/app/models/document';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalsService } from 'src/app/services/globals/globals.service';
import { AsyncPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { NoItemsNotificationComponent } from '../../components/no-items-notification/no-items-notification.component';
import { LoadingSpinnerContentComponent } from '../../components/loading-spinner-content/loading-spinner-content.component';
import { LoginRequiredMessageComponent } from '../../components/login-required-message/login-required-message.component';

@Component({
    selector: 'app-documents',
    templateUrl: './documents.component.html',
    styleUrls: ['./documents.component.scss'],
    imports: [MatIcon, NoItemsNotificationComponent, LoadingSpinnerContentComponent, LoginRequiredMessageComponent, AsyncPipe]
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
