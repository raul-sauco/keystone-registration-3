import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaiverContentComponent } from './waiver-content.component';

describe('WaiverContentComponent', () => {
  let component: WaiverContentComponent;
  let fixture: ComponentFixture<WaiverContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaiverContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaiverContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
