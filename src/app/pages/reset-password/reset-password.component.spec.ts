import { HttpClientTestingModule } from '@angular/common/http/testing';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { TranslateTestingModule } from 'ngx-translate-testing';

import { ResetPasswordComponent } from './reset-password.component';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        providers: [
          {
            provide: MatDialogRef,
            useValue: {},
          },
          UntypedFormBuilder,
        ],
        declarations: [ResetPasswordComponent],
        imports: [
          HttpClientTestingModule,
          RouterTestingModule,
          LoggerTestingModule,
          TranslateTestingModule.withTranslations({
            en: require('src/assets/i18n/en.json'),
          }),
          FormsModule,
          ReactiveFormsModule,
          BrowserAnimationsModule, // Material needs animations
          MatButtonModule,
          MatInputModule,
          MatProgressBarModule,
          MatDialogModule,
          MatFormFieldModule,
          MatSidenavModule,
          MatToolbarModule,
          MatListModule,
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
