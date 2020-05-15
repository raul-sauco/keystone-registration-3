import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginRequiredMessageComponent } from './login-required-message.component';

describe('LoginRequiredMessageComponent', () => {
  let component: LoginRequiredMessageComponent;
  let fixture: ComponentFixture<LoginRequiredMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginRequiredMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginRequiredMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
