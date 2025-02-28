import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserlistsComponent } from './userlists.component';

describe('UserlistsComponent', () => {
  let component: UserlistsComponent;
  let fixture: ComponentFixture<UserlistsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserlistsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserlistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
