import { HttpClientTestingModule } from '@angular/common/http/testing';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyDialogRef as MatDialogRef, MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';
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
