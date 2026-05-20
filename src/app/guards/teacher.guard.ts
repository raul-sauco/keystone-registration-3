import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '@services/auth/auth.service';

export const teacherGuard: CanActivateFn = (_route, _state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.authenticated() && auth.isTeacher) {
    return true;
  }

  return router.createUrlTree(['/home']);
};
