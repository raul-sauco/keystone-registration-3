import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { NoResultsComponent } from './no-results.component';

@NgModule({
  declarations: [NoResultsComponent],
  imports: [CommonModule, MatIconModule, TranslateModule],
  exports: [NoResultsComponent],
})
export class NoResultsModule {}
