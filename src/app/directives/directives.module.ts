import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordMatchValidatorDirective } from './password-match-validator.directive';
import { UniqueUsernameValidatorDirective } from './unique-username-validator.directive';



@NgModule({
  declarations: [
    PasswordMatchValidatorDirective,
    UniqueUsernameValidatorDirective
  ],
  imports: [
    CommonModule
  ]
})
export class DirectivesModule { }
