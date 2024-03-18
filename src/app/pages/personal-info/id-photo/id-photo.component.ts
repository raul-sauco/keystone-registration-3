import { Component, Input } from '@angular/core';
import { Student } from '@models/student';

@Component({
  selector: 'app-id-photo',
  standalone: true,
  imports: [],
  templateUrl: './id-photo.component.html',
  styleUrl: './id-photo.component.scss',
})
export class IdPhotoComponent {
  @Input() student!: Student;
}
