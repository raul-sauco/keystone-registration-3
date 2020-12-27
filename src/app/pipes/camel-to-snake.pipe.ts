import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'camelToSnake',
})
export class CamelToSnakePipe implements PipeTransform {
  transform(value: string): string {
    return value.replace(/[A-Z]/g, (letter) => `_${letter}`).toUpperCase();
  }
}
