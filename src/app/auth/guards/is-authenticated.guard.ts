import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthStatus } from '../interfaces';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  // if(authService.authStatus===AuthStatus.authentitcated)
  // const url = state.url;
  // localStorage.setItem('url', url);
  // console.log(url);
  // console.log({ route, state });
  // console.log({state:authService.authStatus()})
  if (authService.authStatus() === AuthStatus.authentitcated) {
    return true;
  }
  if (authService.authStatus() === AuthStatus.checking) {
    return false;
  }
  router.navigateByUrl('/auth/login');
  return false;
};
