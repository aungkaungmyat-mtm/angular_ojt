import { Component, OnDestroy, OnInit } from '@angular/core';
// import { Role, User } from '../../../auth/interfaces/interfaces';

import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';
import { User } from '../../../auth/interfaces/auth-interfaces';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-profile',
  imports: [NgIf, MatIconModule, RouterLink],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent implements OnInit, OnDestroy {
  userProfileData: User | undefined;
  defaultImage = 'https://th.bing.com/th/id/OIP.QOMRexd-LyIorC_N-w1bvwAAAA?rs=1&pid=ImgDetMain';
  private destroy$ = new Subject<void>();

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.getUserProfile();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getUserProfile(): void {
    this.userService
      .getCurrentUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: res => {
          this.userProfileData = res;
        },
        error: err => {
          console.error(err);
        },
      });
  }

  getUserImage(): string {
    if (this.userProfileData?.image?.url) {
      return `${environment.apiBaseUrl}${this.userProfileData.image.url}`; // If user has an image
    } else {
      return this.defaultImage; // If user has no image, show default
    }
  }

  closeProfile(): void {
    this.userService.closeProfile();
  }
}
