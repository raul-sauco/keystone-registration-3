import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GuidesRoutingModule } from './guides-routing.module';
import { GuidesComponent } from './guides.component';
import { LoadingSpinnerContentModule } from 'src/app/components/loading-spinner-content/loading-spinner-content.module';
import { MarkdownModule } from 'ngx-markdown';
import { MatSnackBarModule } from '@angular/material/snack-bar';


@NgModule({
  declarations: [GuidesComponent],
  imports: [
    CommonModule,
    GuidesRoutingModule,
    MatSnackBarModule,
    LoadingSpinnerContentModule,
    MarkdownModule.forChild()
  ]
})
export class GuidesModule { }
