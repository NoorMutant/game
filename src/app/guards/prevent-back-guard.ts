
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const preventBackGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  preventBackNavigation(router);
  return true; 
};
function preventBackNavigation(router: Router): void {

  setTimeout(() => {
    if (window.history && window.history.pushState) {
      window.history.pushState(null, '', window.location.href);
    }
  }, 100);

const handleBack = (event: PopStateEvent): void => {
  event.preventDefault(); 
  const userId = localStorage.getItem('currentUserId');
  if (window.history && window.history.replaceState) {
    window.history.replaceState(null, '', window.location.href);
  }
  if (userId) {
    router.navigateByUrl('/home', { replaceUrl: true });
  } else {
    router.navigateByUrl('/signup', { replaceUrl: true });
  }
};

  window.removeEventListener('popstate', handleBack);
  window.addEventListener('popstate', handleBack);
}