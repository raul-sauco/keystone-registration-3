import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CamelToSnakePipe } from './camel-to-snake.pipe';

@NgModule({
  declarations: [CamelToSnakePipe],
  imports: [CommonModule],
  exports: [CamelToSnakePipe],
})
export class PipesModule {}
