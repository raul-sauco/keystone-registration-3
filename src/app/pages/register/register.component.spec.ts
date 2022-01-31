import { lastValueFrom, of } from 'rxjs';
import { MatDialogModule } from '@angular/material/dialog';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LoggerTestingModule } from 'ngx-logger/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { RegisterComponent } from './register.component';
import { TranslateService } from '@ngx-translate/core';
import { TranslateServiceStub } from 'src/testing/src/stubs/translate-service-stub';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TripCodesComponent } from '../trip-codes/trip-codes.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        providers: [
          { provide: TranslateService, useClass: TranslateServiceStub },
        ],
        declarations: [RegisterComponent],
        imports: [
          HttpClientTestingModule,
          RouterTestingModule.withRoutes([
            { path: 'trip-codes', component: TripCodesComponent },
          ]),
          LoggerTestingModule,
          FormsModule,
          ReactiveFormsModule,
          MatDialogModule,
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
