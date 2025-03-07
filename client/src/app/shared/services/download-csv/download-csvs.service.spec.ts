import { TestBed } from '@angular/core/testing';

import { DownloadCsvsService } from './download-csvs.service';

describe('DownloadCsvsService', () => {
  let service: DownloadCsvsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DownloadCsvsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
