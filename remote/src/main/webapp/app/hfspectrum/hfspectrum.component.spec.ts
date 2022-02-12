import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HfspectrumComponent } from './hfspectrum.component';

describe('HfspectrumComponent', () => {
  let component: HfspectrumComponent;
  let fixture: ComponentFixture<HfspectrumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HfspectrumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HfspectrumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
