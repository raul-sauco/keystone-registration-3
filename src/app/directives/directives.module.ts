import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordMatchValidatorDirective } from './password-match-validator.directive';
import { UniqueUsernameValidatorDirective } from './unique-username-validator.directive';
import { ContenteditableDirective } from './contenteditable.directive';

@NgModule({
  declarations: [
    PasswordMatchValidatorDirective,
    UniqueUsernameValidatorDirective,
    ContenteditableDirective,
  ],
  imports: [CommonModule],
  exports: [ContenteditableDirective],
})
export class DirectivesModule {}
