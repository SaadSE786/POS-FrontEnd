import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialPageLoaderComponent } from './initial-page-loader.component';

describe('InitialPageLoaderComponent', () => {
  let component: InitialPageLoaderComponent;
  let fixture: ComponentFixture<InitialPageLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InitialPageLoaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InitialPageLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
