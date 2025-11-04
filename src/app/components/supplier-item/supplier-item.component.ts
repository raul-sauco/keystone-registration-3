import { Component, Input, OnInit, inject } from '@angular/core';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { Supplier } from 'src/app/models/supplier';
import { GlobalsService } from 'src/app/services/globals/globals.service';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';
import { NgIf } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-supplier-item',
    templateUrl: './supplier-item.component.html',
    styleUrls: ['./supplier-item.component.scss'],
    imports: [MatCard, MatCardHeader, MatCardTitle, MatCardContent, NgIf, MatButton, MatIcon, TranslatePipe]
})
export class SupplierItemComponent implements OnInit {
  private globals = inject(GlobalsService);
  translate = inject(TranslateService);

  @Input() supplier!: Supplier;
  url!: string;
  lang!: string;

  ngOnInit(): void {
    this.url = this.globals.getResUrl();
    this.lang = this.translate.currentLang.includes('zh') ? 'zh' : 'en';
  }
}
