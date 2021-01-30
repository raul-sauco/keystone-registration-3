import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';

import { LoadingSpinnerContentModule } from 'src/app/components/loading-spinner-content/loading-spinner-content.module';
import { ChildProtectionRoutingModule } from './child-protection-routing.module';
import { ChildProtectionComponent } from './child-protection.component';

@NgModule({
  declarations: [ChildProtectionComponent],
  imports: [
    CommonModule,
    ChildProtectionRoutingModule,
    LoadingSpinnerContentModule,
    MarkdownModule,
  ],
})
export class ChildProtectionModule {}
