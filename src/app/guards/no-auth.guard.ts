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
export class NoAuthGuard {
  constructor(private auth: AuthService, private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.auth.authenticated) {
      this.router.navigateByUrl('/home');
      return false;
    }
    return this.auth.checkAuthenticated().then((res) => {
      if (res) {
        this.router.navigateByUrl('/home');
        return false;
      }
      return true;
    });
  }
}
