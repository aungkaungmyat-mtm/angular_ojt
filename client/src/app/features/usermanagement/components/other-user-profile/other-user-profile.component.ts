import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../../auth/interfaces/auth-interfaces';

import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-other-user-profile',
  imports: [ MatIcon],
  templateUrl: './other-user-profile.component.html',
  styleUrl: './other-user-profile.component.css',
})
export class OtherUserProfileComponent implements OnInit {
  temporaryId: number = 0;
  otherUserProfileData: User | undefined;
  defaultImage = 'https://th.bing.com/th/id/OIP.QOMRexd-LyIorC_N-w1bvwAAAA?rs=1&pid=ImgDetMain';

  private readonly userSerive = inject(UserService);
  private readonly activatedRoute = inject(ActivatedRoute);

  constructor() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id && !isNaN(Number(id))) {
      this.temporaryId = Number(id);
    }
  }
  ngOnInit(): void {
    this.showOtherUserProfile();
  }

  showOtherUserProfile() {
    this.userSerive.getUserProfileById(this.temporaryId).subscribe({
      next: res => {
        // console.log(res);
        this.otherUserProfileData = res;
      },
      error: err => {
        console.error(err);
      },
    });
  }

  closeProfile(): void {
    this.userSerive.closeProfile();
  }

  getUserImage(): string {
    if (this.otherUserProfileData && this.otherUserProfileData.image && this.otherUserProfileData.image.url) {
      return `http://localhost:1337${this.otherUserProfileData.image.url}`; // If user has an image
    } else {
      return this.defaultImage; // If user has no image, show default
    }
  }
}
