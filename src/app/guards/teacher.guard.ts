import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TeacherGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkIsTeacher(state.url);
  }

  /**
   * Check if we have an authenticated user and it is of type teacher.
   */
  checkIsTeacher(url: string): boolean {
    if (this.auth.authenticated && this.auth.getCredentials().type === 4) {
      return true;
    }
    this.router.navigateByUrl('/home');
    return false;
  }
}
