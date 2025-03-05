import { Component, OnInit } from '@angular/core';
// import { Role, User } from '../../../auth/interfaces/interfaces';

import { UserService } from '../../services/user.service';
import { NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import { User } from '../../../auth/interfaces/auth-interfaces';

@Component({
  selector: 'app-user-profile',
  imports: [NgIf,MatIconModule, RouterLink],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {

  userProfileData: User | undefined;
  // role: Role | undefined;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.getUserProfile();
  }

  getUserProfile(): void {
    this.userService.getCurrentUser().subscribe(
      res => {
        this.userProfileData = res;

      },
      error => {
        console.error( error);
      }
    );
  }

  closeProfile(): void {


    this.router.navigate(['/user/list']);
  }
}
