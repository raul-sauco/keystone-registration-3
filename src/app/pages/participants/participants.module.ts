import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { TranslateModule } from '@ngx-translate/core';

import { LoadingSpinnerContentModule } from 'src/app/components/loading-spinner-content/loading-spinner-content.module';
import { DirectivesModule } from './../../directives/directives.module';
import { ParticipantsRoutingModule } from './participants-routing.module';
import { ParticipantsComponent } from './participants.component';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  declarations: [ParticipantsComponent],
  imports: [
    CommonModule,
    DirectivesModule,
    LoadingSpinnerContentModule,
    MatTableModule,
    MatSnackBarModule,
    ParticipantsRoutingModule,
    PipesModule,
    TranslateModule,
  ],
})
export class ParticipantsModule {}
