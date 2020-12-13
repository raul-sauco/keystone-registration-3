import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-waiver-content',
  templateUrl: './waiver-content.component.html',
  styleUrls: ['./waiver-content.component.scss'],
})
export class WaiverContentComponent implements OnInit {
  constructor(public translate: TranslateService) {}

  ngOnInit(): void {}
}
