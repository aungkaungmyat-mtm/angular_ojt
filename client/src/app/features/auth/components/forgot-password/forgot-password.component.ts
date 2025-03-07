import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError } from '@angular/material/form-field';
import { RouterLink } from '@angular/router';
import { LoadingService } from '../../../../core/services/loading/loading.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  imports: [NgIf, ReactiveFormsModule, MatError, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  message: string = '';
  forgotPasswordForm: FormGroup;
  successful: boolean = false;
  private loadingService = inject(LoadingService);

  constructor(private authService: AuthService, private formBuilder: FormBuilder) {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    this.loadingService.show();
    this.authService.forgotPassword(this.forgotPasswordForm.value.email).subscribe({
      next: () => {
        this.message = 'Check your email to reset your password';
        this.loadingService.hide();
        this.checkForgotPasswordSuccessful();
      },
      error: () => {
        this.message = 'An error has occured';
        this.loadingService.hide();
        console.error(Error);
      },
    });
  }

  checkForgotPasswordSuccessful() {
    this.successful = true;
  }
}
