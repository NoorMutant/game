import { TestBed } from '@angular/core/testing';

import { Apifetch } from './apifetch';

describe('Apifetch', () => {
  let service: Apifetch;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Apifetch);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
