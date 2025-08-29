import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { fromEvent, startWith } from 'rxjs';

let backButtonPressed = false;

// ✅ Listen to browser back button globally
fromEvent<PopStateEvent>(window, 'popstate').subscribe(() => {
  backButtonPressed = true;
});

export const flowSafetyGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  // const navigation = router.getCurrentNavigation();
  // const isPopState = navigation?.trigger === 'popstate';

   if (backButtonPressed) {
    backButtonPressed = false; // reset for next time
    return false;
  }

  return true;

  const currentUrl = router.url;   
  const targetUrl = state.url;     

  console.log('From:', currentUrl);
  console.log('To:', targetUrl);
  if(currentUrl==="/" || currentUrl ===""|| currentUrl ==="/home"){
    return true
  }

  if (currentUrl === '/login' && targetUrl === '/signup') {
    return true;  
  }
  else if (currentUrl === '/signup' && targetUrl === '/login') {
    return true;  
  }
  else if ((currentUrl === '/signup' || currentUrl ==='/login') &&  (targetUrl === '' || targetUrl === '/' || targetUrl === '/home')) {
    return true;  
  }
  
  else if ((currentUrl === '' || currentUrl === '/' || currentUrl === '/home') && targetUrl.startsWith('/user-selected')) {
    return true;  
  }
  
  else if (currentUrl.startsWith('/user-selected')  && targetUrl.startsWith('/result')) {
    return true;  
  }
  else if (currentUrl.startsWith('/result')  && (targetUrl === '' || targetUrl === '/' || targetUrl === '/home')) {
    return true;  
  }

  else{
    console.warn('Bhaiya kidhr???');
  
    // router.navigateByUrl('');
    return false;

  }
};
