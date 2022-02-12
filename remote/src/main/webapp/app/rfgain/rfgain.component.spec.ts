import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RfgainComponent } from './rfgain.component';

describe('RfgainComponent', () => {
  let component: RfgainComponent;
  let fixture: ComponentFixture<RfgainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RfgainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RfgainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
