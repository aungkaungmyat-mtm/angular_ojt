import { Component, OnInit } from '@angular/core';
import { UserService } from './../../services/user.service';
import { Inject } from '@angular/core';

import { NgIf } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { User } from '../../../../core/interfaces/user';

@Component({
  selector: 'app-edit-user-profile',
  imports: [ReactiveFormsModule, NgIf, RouterLink],
  templateUrl: './edit-user-profile.component.html',
  styleUrl: './edit-user-profile.component.css',
})
export class EditUserProfileComponent implements OnInit {
  editUserForm: FormGroup;
  instanceId: number = 0;
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private activateRoute: ActivatedRoute
  ) {

    this.editUserForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      job: [''],
      bio: [''],
      date_of_birth: [''],
      address: [''],
      image: [''],
      role: [''],
    });
  }

  ngOnInit(): void {
    this.fetchUserProfileData();

    const paramValue = this.activateRoute.snapshot.paramMap.get('id');
    if (paramValue && !isNaN(Number(paramValue))) {
      this.instanceId = Number(paramValue);
    } else {
      console.error('Invalid or missing ID:', paramValue);
      return;
    }
  }

  fetchUserProfileData() {
    this.userService.getCurrentUser().subscribe(data => {
      this.editUserForm.patchValue({
        username: data.username,
        email: data.email,
        job: data.job,
        bio: data.bio,
        date_of_birth: data.date_of_birth,
        address: data.address,
      });

      if (data.image?.url) {
        this.imagePreview = `http://localhost:1337${data.image.url}`;
      }
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];

    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  editUserProfile() {
    if (this.editUserForm.invalid) {
      return;
    }

    const confirmation = confirm('Are you sure you want to update your profile?');
    if (!confirmation) return;

    const formData = this.editUserForm.value;

    if (this.selectedFile) {
      // Upload image first if a new file is selected
      this.userService.uploadImage(this.selectedFile).subscribe(response => {
        const uploadedImageId = response[0].id;
        this.updateUserProfile(uploadedImageId, formData);
      });
    } else {
      // Proceed with existing image
      this.updateUserProfile(undefined, formData);
    }
  }

  updateUserProfile(imageId: number | undefined, formData: any) {
    const updatePayload: User = {
      id: this.instanceId,
      username: formData.username,
      email: formData.email,
      age: formData.age,
      address: formData.address,
      job: formData.job,
      bio: formData.bio,
      date_of_birth: formData.date_of_birth,
      image: imageId ? { id: imageId, url: '', formats: { thumbnail: { url: '' } } } : undefined,
      role: formData.role
        ? typeof formData.role === 'object'
          ? formData.role.id
          : formData.role
        : undefined,
    };

    this.userService.editUserProfile(updatePayload, this.instanceId).subscribe({
      next: () => {
        alert('Profile updated successfully');
        // window.location.reload();
        this.router.navigate(['/user/profile']);
      },
      error: error => {
        console.error('Error updating profile:', error);
      },
    });
  }
}
