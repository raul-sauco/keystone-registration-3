import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { filter, map, Observable, take } from 'rxjs';

import { AuthService } from '@services/auth/auth.service';
import { AuthState } from '@models/auth-state';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  private auth = inject(AuthService);
  private router = inject(Router);

  canActivate(
    _next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> {
    return this.auth.auth$.pipe(
      filter((authState: AuthState) => authState !== AuthState.Unknown),
      take(1),
      map((authState: AuthState) => {
        if (authState === AuthState.Unauthenticated) {
          this.auth.redirectUrl = state.url;
          return this.router.createUrlTree(['/login']);
        }
        return true;
      }),
    );
  }
}
