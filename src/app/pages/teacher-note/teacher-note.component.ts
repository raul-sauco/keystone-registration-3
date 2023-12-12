import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { Observable, map } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-teacher-note',
  templateUrl: './teacher-note.component.html',
  styleUrls: ['./teacher-note.component.scss'],
})
export class TeacherNoteComponent implements OnInit {
  content$!: Observable<string>;

  constructor(
    private logger: NGXLogger,
    private api: ApiService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.logger.debug('TeacherNoteComponent OnInit');
    const endpoint = 'documents/46';
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    this.content$ = this.api
      .get(endpoint, null, options)
      .pipe(
        map((doc: any) =>
          this.translate.currentLang.includes('zh') ? doc.text_zh : doc.text
        )
      );
  }
}
