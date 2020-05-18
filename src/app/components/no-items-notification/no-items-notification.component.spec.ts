import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoItemsNotificationComponent } from './no-items-notification.component';

describe('NoItemsNotificationComponent', () => {
  let component: NoItemsNotificationComponent;
  let fixture: ComponentFixture<NoItemsNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoItemsNotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoItemsNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
