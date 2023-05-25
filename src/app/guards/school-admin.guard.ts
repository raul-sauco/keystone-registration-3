import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '@services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class SchoolAdminGuard {
  constructor(private auth: AuthService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.checkIsSchoolAdmin(state.url);
  }

  checkIsSchoolAdmin(_: string): boolean {
    if (this.auth.authenticated && this.auth.getCredentials()?.type === 8) {
      return true;
    }
    this.router.navigateByUrl('/home');
    return false;
  }
}
