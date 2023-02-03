import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateService } from '@ngx-translate/core';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { MarkdownModule } from 'ngx-markdown';
import { TranslateServiceStub } from 'src/testing/src/stubs/translate-service-stub';

import { TeacherNoteComponent } from './teacher-note.component';

describe('TeacherNoteComponent', () => {
  let component: TeacherNoteComponent;
  let fixture: ComponentFixture<TeacherNoteComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        providers: [
          { provide: TranslateService, useClass: TranslateServiceStub },
        ],
        declarations: [TeacherNoteComponent],
        imports: [
          HttpClientTestingModule,
          BrowserAnimationsModule,
          RouterTestingModule,
          LoggerTestingModule,
          MarkdownModule.forRoot(),
          MatCardModule,
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
