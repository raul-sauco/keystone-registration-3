import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackingListItemComponent } from './packing-list-item.component';
import { MarkdownModule } from 'ngx-markdown';
import { TripPackingListItem } from 'src/app/models/tripPackingListItem';
import { LoadingSpinnerContentModule } from '../loading-spinner-content/loading-spinner-content.module';
import { TranslateTestingModule } from 'ngx-translate-testing';

describe('PackingListItemComponent', () => {
  let component: PackingListItemComponent;
  let fixture: ComponentFixture<PackingListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackingListItemComponent ],
      imports: [
        MarkdownModule.forRoot(),
        LoadingSpinnerContentModule,
        TranslateTestingModule.withTranslations({
          en: require('src/assets/i18n/en.json')
        })
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackingListItemComponent);
    component = fixture.componentInstance;

    // Inject the input property
    component.pli = new TripPackingListItem(    {
      trip_id: 143,
      packing_list_item_id: 53,
      name: null,
      name_zh: null,
      remarks: null,
      remarks_zh: null,
      description: null,
      description_zh: null,
      footer: null,
      footer_zh: null,
      image: null,
      bring: 2,
      quantity: null,
      order: 530,
      item: {
          id: 53,
          name: 'Weapons, Real and Fake',
          name_zh: '武器（无论真假）',
          remarks: '',
          remarks_zh: '',
          description: 'Do not bring any knives, blades, or firearms, even fake ones like cap guns. They will cause you huge headaches with your teachers and airport security!',
          description_zh: '请勿携带刀、剑或任何武器，包括仿真枪。这类物品会给您自己带来很大的麻烦，不管是您的老师还是机场保安都不会放过您的！',
          footer: '',
          footer_zh: '',
          image: 'weapons.png',
          bring: 2,
          quantity: '',
          order: 530,
          created_at: 1548989499,
          updated_at: 1549117442,
          created_by: 1,
          updated_by: 1
      }
  },
);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
