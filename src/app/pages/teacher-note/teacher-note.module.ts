import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';

import { LoadingSpinnerContentModule } from './../../components/loading-spinner-content/loading-spinner-content.module';
import { TeacherNoteRoutingModule } from './teacher-note-routing.module';
import { TeacherNoteComponent } from './teacher-note.component';

@NgModule({
  declarations: [TeacherNoteComponent],
  imports: [
    CommonModule,
    TeacherNoteRoutingModule,
    LoadingSpinnerContentModule,
    MarkdownModule,
  ],
})
export class TeacherNoteModule {}
