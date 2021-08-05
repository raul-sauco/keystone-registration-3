import { Supplier } from './../../models/supplier';
import { TranslateService } from '@ngx-translate/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { SupplierItemComponent } from './supplier-item.component';
import { TranslateServiceStub } from 'src/testing/src/stubs/translate-service-stub';

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
