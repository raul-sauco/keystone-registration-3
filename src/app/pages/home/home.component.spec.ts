import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, convertToParamMap, ParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { MarkdownModule } from 'ngx-markdown';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { Observable, of } from 'rxjs';
import { Spied } from 'src/app/interfaces/spied';
import { RouteStateService } from './../../services/route-state/route-state.service';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let element: DebugElement;
  let activatedRouteSpy: Spied<ActivatedRoute>;
  let routeStateServiceSpy: Spied<RouteStateService>;

  beforeEach(waitForAsync(() => {
    activatedRouteSpy = jasmine.createSpyObj(
      'ActivatedRoute',
      {
        checkAuthenticated: Promise.resolve(true),
      },
      {
        paramMap: of(
          convertToParamMap({
            'trip-id': 111,
          })
        ),
      }
    );
    routeStateServiceSpy = jasmine.createSpyObj('RouteStateService', {
      getTripId: '112',
      updateTripIdParamState: null,
      setNullTripIdParamState: null,
    });
    TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [
        BrowserAnimationsModule,
        RouterTestingModule,
        LoggerTestingModule,
        TranslateTestingModule.withTranslations({
          en: require('src/assets/i18n/en.json'),
        }),
        MarkdownModule.forRoot(),
        MatCardModule,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: activatedRouteSpy,
        },
        {
          provide: RouteStateService,
          useValue: routeStateServiceSpy,
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement;
    // fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 12 material cards', () => {
    fixture.detectChanges();
    const cards = element.queryAll(By.css('mat-card'));
    expect(cards.length).toEqual(12);
  });

  it('should have a first card with title About Keystone Adventures', () => {
    fixture.detectChanges();
    const nativeElement: HTMLElement = fixture.nativeElement;
    const firstCard = nativeElement.querySelector('mat-card');
    expect(firstCard).toBeTruthy();
    const title = firstCard?.querySelector('mat-card-title');
    expect(title).toBeTruthy();
    expect(title?.textContent).toBeTruthy('About Keystone Adventures');
  });

  it('paramMap should return 111 trip-id', waitForAsync(() => {
    const paramMap =
      activatedRouteSpy.paramMap as unknown as Observable<ParamMap>;
    paramMap.subscribe((params: ParamMap) => {
      expect(params.get('trip-id')?.toString()).toEqual('111');
    });
  }));

  it('should call checkTripIdParam and update trip Id', () => {
    spyOn(component, 'checkTripIdParam').and.callThrough();
    fixture.detectChanges();
    expect(component.checkTripIdParam).toHaveBeenCalledOnceWith();
    expect(
      routeStateServiceSpy.updateTripIdParamState
    ).toHaveBeenCalledOnceWith(111);
  });

  it('should not do anything when url does not have trip id', () => {
    spyOn(component, 'checkTripIdParam').and.callThrough();
    // Update spy object property value
    // https://jasmine.github.io/tutorials/spying_on_properties
    const propertyDescriptor = Object.getOwnPropertyDescriptor(
      activatedRouteSpy,
      'paramMap'
    );
    if (propertyDescriptor) {
      const paramMap = propertyDescriptor.get as jasmine.Spy;
      paramMap.and.returnValue(
        of(
          convertToParamMap({
            'trip-id': null,
          })
        )
      );
    }
    fixture.detectChanges();
    expect(component.checkTripIdParam).toHaveBeenCalledOnceWith();
    expect(routeStateServiceSpy.updateTripIdParamState).not.toHaveBeenCalled();
  });

  it('should not do call checkTripIdParam when trip ids are equal', () => {
    // Update method spy return value https://stackoverflow.com/a/28891166/2557030
    spyOn(component, 'checkTripIdParam').and.callThrough();
    routeStateServiceSpy.getTripId.and.returnValue(111);
    fixture.detectChanges();
    expect(component.checkTripIdParam).toHaveBeenCalledOnceWith();
    expect(routeStateServiceSpy.updateTripIdParamState).not.toHaveBeenCalled();
  });
});
