import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Addstock } from './addstock';

describe('Addstock', () => {
  let component: Addstock;
  let fixture: ComponentFixture<Addstock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Addstock]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Addstock);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
