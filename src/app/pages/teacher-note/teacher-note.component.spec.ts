import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherNoteComponent } from './teacher-note.component';

describe('TeacherNoteComponent', () => {
  let component: TeacherNoteComponent;
  let fixture: ComponentFixture<TeacherNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeacherNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
