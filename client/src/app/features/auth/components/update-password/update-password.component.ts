import { NgIf } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { SnackbarService } from '../../../../core/services/snackbar/snackbar.service';
import { passwordMatch } from '../../../../core/utils/validators';
import { UpdatePasswordRequest } from '../../interfaces/auth-interfaces';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-update-password',
  imports: [NgIf, MatError, ReactiveFormsModule, MatIcon],
  templateUrl: './update-password.component.html',
  styleUrl: './update-password.component.css',
})
export class UpdatePasswordComponent implements OnDestroy {
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  message = '';
  error = '';
  private subscription: Subscription | null = null;
  private readonly authservice = inject(AuthService);
  private formBuilder = inject(FormBuilder);
  private snackbarService = inject(SnackbarService);
  updatePasswordForm: FormGroup;
  constructor() {
    this.updatePasswordForm = this.formBuilder.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, passwordMatch('newPassword')]],
    });
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  onSubmit() {
    if (this.updatePasswordForm.invalid) {
      return;
    }
    const updatePasswordRequest: UpdatePasswordRequest = {
      currentPassword: this.updatePasswordForm.value.currentPassword,
      password: this.updatePasswordForm.value.newPassword,
      passwordConfirmation: this.updatePasswordForm.value.confirmPassword,
    };
    this.subscription = this.authservice.updatePassword(updatePasswordRequest).subscribe({
      next: () => {
        this.message = 'Password updated successfully';
        this.snackbarService.open(this.message);
        this.updatePasswordForm.reset();
      },
      error: error => {
        console.error('Error updating password:', error);
        if (error.status === 400) {
          this.error = 'Your current password is incorrect';
        } else if (error.status === 401) {
          this.error = 'You are not authorized to change this password';
        } else {
          this.error = 'An error occurred. Please try again later.';
        }

        this.snackbarService.open(this.error);
      },
    });
  }

  toggleCurrentPasswordVisibility() {
    this.showCurrentPassword = !this.showCurrentPassword;
  }

  toggleNewPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
