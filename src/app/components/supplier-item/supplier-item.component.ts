import { Component, Input, OnInit } from '@angular/core';

import { Supplier } from './../../models/supplier';
import { GlobalsService } from 'src/app/services/globals/globals.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-supplier-item',
  templateUrl: './supplier-item.component.html',
  styleUrls: ['./supplier-item.component.scss'],
})
export class SupplierItemComponent implements OnInit {
  @Input() supplier!: Supplier;
  url!: string;
  lang!: string;

  constructor(
    private globals: GlobalsService,
    public translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.url = this.globals.getResUrl();
    this.lang = this.translate.currentLang.includes('zh') ? 'zh' : 'en';
  }
}
