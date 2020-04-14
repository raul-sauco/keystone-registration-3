import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'Keystone Adventures';
  auth = null;

  public appPages = [
    {title: 'HOME', url: '/home', icon: 'home'},
    {title: 'ITINERARY', url: '/itinerary', icon: 'list'},
    {title: 'PACKING_LIST', url: '/packing-list', icon: 'work'},
    {title: 'GUIDES', url: '/guides', icon: 'contacts'},
    {title: 'FAQ', url: '/faq', icon: 'chatbubbles'},
    {title: 'DOCUMENTS', url: '/documents', icon: 'document'}
  ];

  public policyPages = [
    {title: 'WAIVER', url: '/waiver', icon: 'paper'},
    {title: 'PRIVACY_POLICY', url: '/privacy-policy', icon: 'glasses'}
  ];

  public mePages = [
    {title: 'PERSONAL_INFORMATION', url: '/personal-info', icon: 'person'}
  ];

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private translate: TranslateService
    ) {
      this.initTranslate();
    }

  initTranslate() {

    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('en');
    const browserLang = this.translate.getBrowserLang();

    if (browserLang) {
      if (browserLang === 'zh') {
        const browserCultureLang = this.translate.getBrowserCultureLang();

        if (browserCultureLang.match(/-CN|CHS|Hans/i)) {
          this.translate.use('zh-cmn-Hans');
        } else if (browserCultureLang.match(/-TW|CHT|Hant/i)) {
          this.translate.use('zh-cmn-Hant');
        }
      } else {
        this.translate.use(this.translate.getBrowserLang());
      }
    } else {
      this.translate.use('en'); // Set your language here
    }

    // todo delete the next line after tests
    // this.translate.use('zh-cmn-Hans');

  }

}
