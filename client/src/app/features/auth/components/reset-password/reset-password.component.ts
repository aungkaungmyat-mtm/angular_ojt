import { NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SnackbarService } from '../../../../core/services/snackbar/snackbar.service';
import { passwordMatch } from '../../../../core/utils/validators';
import { resetPasswordRequest } from '../../interfaces/auth-interfaces';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  imports: [NgIf, ReactiveFormsModule, MatIcon, MatError, RouterLink],
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  private snackbar = inject(SnackbarService);
  message: string = '';
  resetPasswordForm: FormGroup;
  resetCode: string = '';
  showConfirmPassword = false;
  showPassword = false;
  errorMessage = '';
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private acitvatedRoute: ActivatedRoute
  ) {
    this.resetPasswordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordConfirmation: ['', [Validators.required, passwordMatch('password')]], // Changed from confirmPassword to passwordConfirmation
    });
  }
  ngOnInit() {
    // Get the "code" from the URL
    this.acitvatedRoute.queryParams.subscribe(params => {
      this.resetCode = params['code'];
      console.log('reset code', this.resetCode);
    });
  }

  onSubmit() {
    if (this.resetPasswordForm.invalid) {
      this.message = 'Please fill out the form correctly.';
      return;
    }

    const resetPasswordRequest: resetPasswordRequest = {
      code: this.resetCode,
      password: this.resetPasswordForm.value.password,
      passwordConfirmation: this.resetPasswordForm.value.passwordConfirmation,
    };

    this.authService.resetPassword(resetPasswordRequest).subscribe({
      next: () => {
        this.message = 'Password reset successfully.';
        this.snackbar.open(this.message);
      },
      error: error => {
        this.message = 'Your reset passowrd code is expired or invalid.';
        console.error(error);
        this.snackbar.open(this.message);
      },
    });
  }
  get password() {
    return this.resetPasswordForm.get('password');
  }

  get passwordConfirmation() {
    return this.resetPasswordForm.get('passwordConfirmation');
  }
}
