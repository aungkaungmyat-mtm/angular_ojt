import { Component, OnInit } from '@angular/core';
import { UserService } from './../../services/user.service';

import { NgIf } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError } from '@angular/material/form-field';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { environment } from '../../../../../environments/environment.development';
import { ProfileImage, User } from '../../../../core/interfaces/user';
import { SnackbarService } from '../../../../core/services/snackbar/snackbar.service';
import { CoreUserService } from '../../../../core/services/user/core-user.service';
import { ConfirmDialogService } from '../../../../core/services/confirm-dialog/confirm-dialog.service';

@Component({
  selector: 'app-edit-user-profile',
  imports: [ReactiveFormsModule, NgIf, RouterLink, MatError],
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
    private activateRoute: ActivatedRoute,
    private snackbar: SnackbarService,
    private coreUserService: CoreUserService,
    private confirmDialogService: ConfirmDialogService,
  ) {
    const paramValue = this.activateRoute.snapshot.paramMap.get('id');
    if (paramValue && !isNaN(Number(paramValue))) {
      this.instanceId = Number(paramValue);
    } else {
      console.error('Invalid or missing ID:', paramValue);
    }

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
        this.imagePreview = `${environment.apiBaseUrl}${data.image.url}`;
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
    try {
      const imageobj: ProfileImage | undefined = imageId
        ? {
            id: imageId,
            url: '',
            formats: { thumbnail: { url: '' } },
          }
        : undefined;

      const roleId = formData.role
        ? typeof formData.role === 'object'
          ? formData.role.id
          : formData.role
        : undefined;

      const updatePayload: User = {
        id: this.instanceId,
        username: formData.username,
        email: formData.email,
        address: formData.address,
        job: formData.job,
        bio: formData.bio,
        date_of_birth: formData.date_of_birth,
        image: imageobj,
        role: roleId,
      };
      this.confirmDialogService.confirm('Are you sure you want to update this profile?').subscribe(result => {
        if (result) {
          this.userService.editUserProfile(updatePayload, this.instanceId).subscribe({
            next: () => {
              this.snackbar.open('Profile updated successfully');
              this.router.navigate(['/user/profile']);
              this.coreUserService.loadUser();
            },
            error: error => {
              console.error('Error updating profile:', error);
            },
          });
        }
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      let errorMessage = 'Failed to update profile';

      switch (error.status) {
        case 400:
          errorMessage = 'Invalid form data. Please check your inputs.';
          break;
        case 403:
          errorMessage = 'You do not have permission to update this profile.';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
      }

      this.snackbar.open(errorMessage);
    }
  }
  get email() {
    return this.editUserForm.get('email');
  }
  get username() {
    return this.editUserForm.get('username');
  }
}
