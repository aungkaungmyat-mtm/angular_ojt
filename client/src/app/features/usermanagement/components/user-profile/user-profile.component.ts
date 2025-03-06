import { Component, OnInit } from '@angular/core';
// import { Role, User } from '../../../auth/interfaces/interfaces';

import { UserService } from '../../services/user.service';
import { NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../../auth/interfaces/auth-interfaces';

@Component({
  selector: 'app-user-profile',
  imports: [NgIf, MatIconModule, RouterLink],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent implements OnInit {
  userProfileData: User | undefined;
  defaultImage = 'https://th.bing.com/th/id/OIP.QOMRexd-LyIorC_N-w1bvwAAAA?rs=1&pid=ImgDetMain';
  // role: Role | undefined;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.getUserProfile();
  }

  getUserProfile(): void {
    this.userService.getCurrentUser().subscribe({
      next: res => {
        this.userProfileData = res;
      },
      error: err => {
        console.error(err);
      },
    });
  }

  getUserImage(): string {
    if (this.userProfileData && this.userProfileData.image && this.userProfileData.image.url) {
      return `http://localhost:1337${this.userProfileData.image.url}`; // If user has an image
    } else {
      return this.defaultImage; // If user has no image, show default
    }
  }


  closeProfile(): void {
    this.userService.closeProfile();
  }
}
