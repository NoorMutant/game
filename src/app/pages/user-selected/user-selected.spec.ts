import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSelected } from './user-selected';

describe('UserSelected', () => {
  let component: UserSelected;
  let fixture: ComponentFixture<UserSelected>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserSelected]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserSelected);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
