import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoItemsNotificationComponent } from './no-items-notification.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [CommonModule, TranslateModule, MatIconModule, NoItemsNotificationComponent],
  exports: [NoItemsNotificationComponent],
})
export class NoItemsNotificationModule {}
