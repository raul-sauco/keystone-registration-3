import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateService } from '@ngx-translate/core';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { TripCodesComponent } from 'src/app/pages/trip-codes/trip-codes.component';
import { TranslateServiceStub } from 'src/testing/src/stubs/translate-service-stub';
import { RegisterComponent } from './register.component';

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
          FormsModule,
          HttpClientTestingModule,
          LoggerTestingModule,
          MatDialogModule,
          ReactiveFormsModule,
          RouterTestingModule.withRoutes([
            { path: 'trip-codes', component: TripCodesComponent },
          ]),
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
