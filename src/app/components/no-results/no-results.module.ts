import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { NoResultsComponent } from './no-results.component';

@NgModule({
  imports: [CommonModule, MatIconModule, TranslateModule, NoResultsComponent],
  exports: [NoResultsComponent],
})
export class NoResultsModule {}
