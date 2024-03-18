import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdPhotoComponent } from './id-photo.component';

describe('IdPhotoComponent', () => {
  let component: IdPhotoComponent;
  let fixture: ComponentFixture<IdPhotoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdPhotoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IdPhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
