import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
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
export class UpdatePasswordComponent {
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  message = '';
  error = '';
  private readonly authservice = inject(AuthService);
  private formBuilder = inject(FormBuilder);
  private snakcbarService = inject(SnackbarService);
  updatePasswordForm: FormGroup;
  constructor() {
    this.updatePasswordForm = this.formBuilder.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, passwordMatch('newPassword')]],
    });
  }
  onSubmit() {
    const updatePasswordRequest: UpdatePasswordRequest = {
      currentPassword: this.updatePasswordForm.value.currentPassword,
      password: this.updatePasswordForm.value.newPassword,
      passwordConfirmation: this.updatePasswordForm.value.confirmPassword,
    };
    this.authservice.updatePassword(updatePasswordRequest).subscribe({
      next: () => {
        this.message = 'Password updated successfully';
        this.snakcbarService.open(this.message);
      },
      error: error => {
        console.error('Error updating password:', error);
        this.error = 'Your current password is incorrect';
        this.snakcbarService.open(this.error);
      },
    });
  }
}
