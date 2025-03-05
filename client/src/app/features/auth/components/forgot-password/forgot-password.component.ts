import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MatError } from '@angular/material/form-field';
import { LoadingScreenComponent } from '../../../../shared/components/loading-screen/loading-screen.component';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  imports: [NgIf, ReactiveFormsModule, MatError, LoadingScreenComponent, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  message: string = '';
  forgotPasswordForm: FormGroup;
  successful: boolean = false;
  loadingService: any;

  constructor(private authService: AuthService, private formBuilder: FormBuilder) {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    this.authService
      .forgotPassword(this.forgotPasswordForm.value.email)
      .pipe(
        finalize(() => {
          this.loadingService.hide();
        })
      )
      .subscribe({
        next: () => {
          this.message = 'Check your email to reset your password';
          this.checkForgotPasswordSuccessful();
        },
        error: () => {
          this.message = 'An error has occured';
          console.error(Error);
        },
      });
  }

  checkForgotPasswordSuccessful() {
    this.successful = true;
  }
}
