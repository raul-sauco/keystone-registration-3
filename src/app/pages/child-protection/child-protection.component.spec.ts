import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildProtectionComponent } from './child-protection.component';

describe('ChildProtectionComponent', () => {
  let component: ChildProtectionComponent;
  let fixture: ComponentFixture<ChildProtectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChildProtectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildProtectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
