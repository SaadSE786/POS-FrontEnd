import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTransporterComponent } from './add-transporter.component';

describe('AddTransporterComponent', () => {
  let component: AddTransporterComponent;
  let fixture: ComponentFixture<AddTransporterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddTransporterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTransporterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
