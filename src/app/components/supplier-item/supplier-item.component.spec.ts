import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatIconModule } from '@angular/material/icon';
import { TranslateService } from '@ngx-translate/core';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { Supplier } from 'src/app/models/supplier';
import { TranslateServiceStub } from 'src/testing/src/stubs/translate-service-stub';
import { SupplierItemComponent } from './supplier-item.component';

describe('SupplierItemComponent', () => {
  let component: SupplierItemComponent;
  let fixture: ComponentFixture<SupplierItemComponent>;

  beforeEach(
    waitForAsync(() => {
      const mockTranslateService = {};
      TestBed.configureTestingModule({
        providers: [
          { provide: TranslateService, useClass: TranslateServiceStub },
        ],
        imports: [
          MatButtonModule,
          MatCardModule,
          MatIconModule,
          TranslateTestingModule.withTranslations({
            en: require('src/assets/i18n/en.json'),
          }),
        ],
        declarations: [SupplierItemComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    const supplier = new Supplier({
      id: 1,
      name: 'name',
      name_zh: 'nameZh',
      images: [],
    });
    fixture = TestBed.createComponent(SupplierItemComponent);
    component = fixture.componentInstance;
    component.supplier = supplier;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
