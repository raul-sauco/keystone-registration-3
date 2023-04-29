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
  public chartTitle: string | null = null;
  public pieChartLabels: string[] = [];
  public pieChartData: ChartData<'pie', number[], string> = {
    labels: [],
    datasets: [{ data: [] }],
  };
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];

  constructor() {}

  ngOnInit(): void {
    // The API data needs to be mapped to the shape expected by the
    // Charts.js component.
    this.chartTitle = this.rawData.label;
    this.rawData.data.forEach((item) => {
      this.pieChartData.labels?.push(item.name);
      this.pieChartData.datasets[0].data.push(item.value);
    });
  }
}
