import { MockBuilder, MockRender } from 'ng-mocks';

import { TeacherNoteComponent } from './teacher-note.component';

describe('TeacherNoteComponent', () => {
  beforeEach(() => {
    return MockBuilder(TeacherNoteComponent);
  });

  it('should create', () => {
    const fixture = MockRender(TeacherNoteComponent);
    expect(fixture.point.componentInstance).toBeTruthy();
  });
});
