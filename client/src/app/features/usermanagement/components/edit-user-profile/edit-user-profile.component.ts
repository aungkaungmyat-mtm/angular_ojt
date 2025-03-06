import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule, NgModel } from '@angular/forms';
import { NgIf } from '@angular/common';
import { User } from '../../../auth/interfaces/auth-interfaces';

@Component({
  selector: 'app-edit-user-profile',
  imports: [FormsModule, NgIf, RouterLink],
  templateUrl: './edit-user-profile.component.html',
  styleUrl: './edit-user-profile.component.css',
})
export class EditUserProfileComponent implements OnInit {
  editUserData: User | null = null;
  instanceId: number = 0;
  selectedFile: File | null = null; // Store selected file
  imagePreview: string | null = null; // Image preview URL

  constructor(
    private userService: UserService,
    private router: Router,
    private activateRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.fetchUserProfileData();

    const paramValue = this.activateRoute.snapshot.paramMap.get('id');
    if (paramValue && !isNaN(Number(paramValue))) {
      this.instanceId = Number(paramValue);
    } else {
      console.error('Invalid or missing ID:', paramValue);
      return;
    }

    console.log('User ID:', this.instanceId);
  }

  fetchUserProfileData() {
    this.userService.getCurrentUser().subscribe(data => {
      this.editUserData = {
        id: data.id,
        username: data.username,
        email: data.email,
        age: data.age,
        address: data.address,
        image: data.image ?? { id: 0, url: '', formats: { thumbnail: { url: '' } } }, // Ensure image is properly assigned
      };

      // Set preview URL if an image exists
      if (data.image?.url) {
        this.imagePreview = `http://localhost:1337${data.image.url}`;
      }
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];

    // Preview selected image
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  editUserProfile() {
    const confirmation = confirm('Are you sure you want to update your profile?');
    if (!confirmation) return;

    if (this.selectedFile) {
      // Upload image first if a new file is selected
      this.userService.uploadImage(this.selectedFile).subscribe(response => {
        const uploadedImageId = response[0].id;
        this.updateUserProfile(uploadedImageId);
      });
    } else {
      // Proceed with existing image
      this.updateUserProfile(this.editUserData!.image?.id);
    }
  }

  updateUserProfile(imageId?: number) {
    const updatePayload: User = {
      id: this.editUserData!.id,
      username: this.editUserData!.username,
      email: this.editUserData!.email,
      age: this.editUserData!.age,
      address: this.editUserData!.address,
      image: imageId
        ? {
            id: imageId,
            url: this.editUserData!.image?.url || '',
            formats: this.editUserData!.image?.formats || { thumbnail: { url: '' } },
          }
        : undefined, // Ensure image conforms to Image interface
    };

    this.userService.editUserProfile(updatePayload, this.instanceId).subscribe({
      next: () => {
        alert('Profile updated successfully');
        window.location.reload();
      },
      error: error => {
        console.error('Error updating profile:', error);
      },
    });
  }
}
