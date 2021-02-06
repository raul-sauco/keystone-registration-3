import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TeacherNoteComponent } from './teacher-note.component';

const routes: Routes = [{ path: '', component: TeacherNoteComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeacherNoteRoutingModule {}
