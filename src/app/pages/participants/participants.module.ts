import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { AddParticipantModule } from 'src/app/components/add-participant/add-participant.module';
import { LoadingSpinnerContentModule } from 'src/app/components/loading-spinner-content/loading-spinner-content.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { ParticipantsRoutingModule } from './participants-routing.module';
import {
  DeleteStudentConfirmationDialogComponent,
  ParticipantsComponent,
} from './participants.component';

@NgModule({
  declarations: [
    ParticipantsComponent,
    DeleteStudentConfirmationDialogComponent,
  ],
  imports: [
    AddParticipantModule,
    CommonModule,
    DirectivesModule,
    FormsModule,
    LoadingSpinnerContentModule,
    MatButtonModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMomentDateModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTableModule,
    ParticipantsRoutingModule,
    PipesModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
})
export class ParticipantsModule {}
