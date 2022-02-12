import { TestBed } from '@angular/core/testing';

import { RadioberryService } from './radioberry.service';

describe('RadioberryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RadioberryService = TestBed.get(RadioberryService);
    expect(service).toBeTruthy();
  });
});
