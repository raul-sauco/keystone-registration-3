import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { filter, map, Observable, take } from 'rxjs';

import { AuthState } from '@models/auth-state';
import { AuthService } from '@services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class NoAuthGuard {
  private auth = inject(AuthService);
  private router = inject(Router);

  canActivate(
    _next: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.auth.auth$.pipe(
      filter((authState: AuthState) => authState !== AuthState.Unknown),
      take(1),
      map((authState: AuthState) => authState === AuthState.Unauthenticated
        ? true
        : this.router.createUrlTree(['/home']))
    );
  }
}
