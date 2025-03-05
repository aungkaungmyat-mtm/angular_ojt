import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { passwordMatch } from '../../../../core/utils/validators';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  imports: [NgIf, ReactiveFormsModule],
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent {
  message: string = '';
  resetPasswordForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private authService: AuthService) {
    this.resetPasswordForm = this.formBuilder.group({
      code: ['', Validators.required], // Changed from changePasswordCode to code
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordConfirmation: ['', [Validators.required, passwordMatch('password')]], // Changed from confirmPassword to passwordConfirmation
    });
  }

  onSubmit() {
    if (this.resetPasswordForm.invalid) {
      this.message = 'Please fill out the form correctly.';
      return;
    }

    const resetPasswordRequest = this.resetPasswordForm.value;

    this.authService.resetPassword(resetPasswordRequest).subscribe(
      () => {
        this.message = 'Password reset successfully.';
      },
      (error) => {
        this.message = 'An error has occurred.';
        console.error(error); // Log the actual error for debugging
      }
    );
  }
}
