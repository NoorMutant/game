import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { flowSafetyGuard } from './flow-safety-guard';

describe('flowSafetyGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => flowSafetyGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
