import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackingListItemComponent } from './packing-list-item.component';

describe('PackingListItemComponent', () => {
  let component: PackingListItemComponent;
  let fixture: ComponentFixture<PackingListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackingListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackingListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
