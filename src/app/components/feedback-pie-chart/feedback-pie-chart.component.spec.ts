import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgChartsModule } from 'ng2-charts';

import { FeedbackPieChartComponent } from './feedback-pie-chart.component';

describe('FeedbackPieChartComponent', () => {
  const data = {
    label: 'Test title',
    data: [
      {
        name: 'A',
        value: 21,
      },
      {
        name: 'B',
        value: 52,
      },
      {
        name: 'C',
        value: 12,
      },
      {
        name: 'D',
        value: 2,
      },
      {
        name: 'E',
        value: 1,
      },
    ],
  };
  let component: FeedbackPieChartComponent;
  let fixture: ComponentFixture<FeedbackPieChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FeedbackPieChartComponent],
      imports: [NgChartsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackPieChartComponent);
    component = fixture.componentInstance;
    component.rawData = data;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });

  it('should assign labels', waitForAsync(() => {
    expect(component.pieChartData.labels).toEqual(data.data.map((e) => e.name));
  }));

  it('should assign data', waitForAsync(() => {
    expect(component.pieChartData.datasets[0].data).toEqual(
      data.data.map((e) => e.value)
    );
  }));
});
