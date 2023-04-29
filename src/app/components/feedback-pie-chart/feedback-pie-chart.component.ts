import { Component, Input, OnInit } from '@angular/core';
import { ChartData, ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-feedback-pie-chart',
  templateUrl: './feedback-pie-chart.component.html',
  styleUrls: ['./feedback-pie-chart.component.scss'],
})
export class FeedbackPieChartComponent implements OnInit {
  @Input() rawData!: { label: string; data: { name: string; value: number }[] };
  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: string[] = [
    'Download Sales',
    'In-Store Sales',
    'Mail Sales',
  ];
  public pieChartData: ChartData<'pie', number[], string> = {
    labels: ['Best experience of my life', 'Good experience', 'It was OK'],
    datasets: [
      {
        data: [300, 500, 100],
      },
    ],
  };
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];

  constructor() {}

  ngOnInit(): void {
    console.log('Hello pie charts');
    console.log(this.rawData);
  }
}
