import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { TripCodesComponent } from './trip-codes.component';

describe('TripCodesComponent', () => {
  let component: TripCodesComponent;
  let fixture: ComponentFixture<TripCodesComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TripCodesComponent],
        imports: [
          FormsModule,
          HttpClientTestingModule,
          LoggerTestingModule,
          MatCardModule,
          MatDialogModule,
          MatIconModule,
          MatInputModule,
          NoopAnimationsModule,
          ReactiveFormsModule,
          RouterTestingModule,
          TranslateTestingModule.withTranslations({
            en: require('src/assets/i18n/en.json'),
          }),
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TripCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
