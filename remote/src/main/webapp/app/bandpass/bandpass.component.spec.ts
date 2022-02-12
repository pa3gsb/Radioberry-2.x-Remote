import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BandpassComponent } from './bandpass.component';

describe('BandpassComponent', () => {
  let component: BandpassComponent;
  let fixture: ComponentFixture<BandpassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BandpassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BandpassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
