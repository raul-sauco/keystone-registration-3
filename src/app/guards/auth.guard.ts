import { Injectable, inject } from '@angular/core';
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
export class AuthGuard {
  private auth = inject(AuthService);
  private router = inject(Router);

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    // If we have no user, redirect to the login page.
    if (!this.auth.authenticated) {
      this.auth.redirectUrl = state.url;
      this.router.navigateByUrl('/login');
      return false;
    }
    // Async check the authenticated status.
    return this.auth.checkAuthenticated().then((res) => {
      if (!res) {
        this.auth.redirectUrl = state.url;
        this.router.navigateByUrl('/login');
        return false;
      }
      return true;
    });
  }
}
