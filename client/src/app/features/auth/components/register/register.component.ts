import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatError, MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { passwordMatch } from '../../../../core/utils/validators';
import { LoadingScreenComponent } from '../../../../shared/components/loading-screen/loading-screen.component';
import { LoadingService } from '../../../../shared/services/loading/loading.service';
import { RegisterRequest } from '../../interfaces/auth-interfaces';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [
    RouterLink,
    CommonModule,
    MatIcon,
    MatInputModule,
    ReactiveFormsModule,
    MatError,
    LoadingScreenComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  success: string = '';
  constructor(
    private formbuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private loadingService: LoadingService
  ) {}
  ngOnInit(): void {
    this.registerForm = this.formbuilder.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, passwordMatch('password')]],
    });
  }
  onSubmit(): void {
    if (this.registerForm.invalid) return;
    this.loadingService.show();

    const registerData: RegisterRequest = {
      username: this.registerForm.value.fullName,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
    };

    this.authService
      .register(registerData)
      .pipe(
        finalize(() => {
          this.loadingService.hide();
        })
      )
      .subscribe({
        next: response => {
          this.authService.setToken(response.jwt);
          this.success =
            'Registered successfully. Please Confirm your email to activate your account';
          this.registerForm.reset();
        },
        error: error => {
          console.error('Error while registering: ', error);
        },
      });
  }

  get fullName() {
    return this.registerForm.get('fullName');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }
}
