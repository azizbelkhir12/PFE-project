import { TestBed } from '@angular/core/testing';

import { PaternValidatorsService } from './patern-validators.service';

describe('PaternValidatorsService', () => {
  let service: PaternValidatorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaternValidatorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
