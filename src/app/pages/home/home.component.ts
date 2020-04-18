import { Component, OnInit } from '@angular/core';
import { GlobalsService } from 'src/app/local/globals.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  url: string;
  columns = 1;

  cards = [
    {
      title: 'WELCOME_TO_KA',
      content: 'HOME_CARD_WELCOME_MESSAGE',
      image: 'keystone.jpg'
    },
    {
      title: 'OUR_GOAL',
      content: 'HOME_CARD_OUR_GOAL',
      image: 'goals.png'
    },
    {
      title: 'STAFF',
      content: 'HOME_CARD_STAFF',
      image: 'staff.jpg'
    },
    {
      title: 'CHALLENGE_BY_CHOICE',
      content: 'HOME_CARD_CHALLENGE',
      image: 'challenge.jpg'
    },
    {
      title: 'LOCATIONS',
      content: 'HOME_CARD_LOCATIONS',
      image: 'locations.jpg'
    },
    {
      title: 'RISK_MANAGEMENT',
      content: 'HOME_CARD_RISK_MANAGEMENT',
      image: 'risk.jpg'
    }
  ];

  constructor( globals: GlobalsService ) {
    this.url = globals.getResUrl() + 'img/portal/';
  }

  ngOnInit() {
    this.columns = this.calculateColumns(window.innerWidth);
  }

  onResize(event) {
    this.columns = this.calculateColumns(event.target.innerWidth);
  }

  /**
   * Calculate the number of columns that the grid should have
   * based on the container's width.
   *
   * @param width The width of the container
   */
  calculateColumns(width: number) {
    if (width < 768) { return 1; }
    if (width < 1200) { return 2; }
    return 3;
  }

}
