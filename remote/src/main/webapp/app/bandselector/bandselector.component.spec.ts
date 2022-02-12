import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BandselectorComponent } from './bandselector.component';

describe('BandselectorComponent', () => {
  let component: BandselectorComponent;
  let fixture: ComponentFixture<BandselectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BandselectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BandselectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
