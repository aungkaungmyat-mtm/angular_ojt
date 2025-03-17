import { TestBed } from '@angular/core/testing';

import { CoreUserService } from './core-user.service';

describe('UserService', () => {
  let service: CoreUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoreUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
