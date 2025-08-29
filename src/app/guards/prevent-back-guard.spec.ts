import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { preventBackGuard } from './prevent-back-guard';
preventBackGuard

describe('preventBackGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => preventBackGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
