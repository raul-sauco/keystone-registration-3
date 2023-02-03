import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { TranslateModule } from '@ngx-translate/core';
import { AddParticipantModule } from 'src/app/components/add-participant/add-participant.module';
import { AdminBannerModule } from 'src/app/components/admin-banner/admin-banner.module';
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
    AdminBannerModule,
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
    MatSortModule,
    MatTableModule,
    ParticipantsRoutingModule,
    PipesModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
})
export class ParticipantsModule {}
