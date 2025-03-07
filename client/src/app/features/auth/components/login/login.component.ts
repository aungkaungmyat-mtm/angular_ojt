import { CommonModule, isPlatformServer } from '@angular/common';
import { Component, inject, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { LoadingService } from '../../../../core/services/loading/loading.service';
import { SnackbarService } from '../../../../core/services/snackbar/snackbar.service';
import { LoginRequest } from '../../interfaces/auth-interfaces';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, CommonModule, MatIcon, MatInputModule, ReactiveFormsModule, MatError],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  showPassword = false;
  errorMessage = '';
  isServer = false;
  private readonly snackBar = inject(SnackbarService);
  private readonly loadingService = inject(LoadingService);
  constructor(
    private readonly formbuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    @Inject(PLATFORM_ID) private readonly platformId: string
  ) {
    this.isServer = isPlatformServer(this.platformId);
  }
  ngOnInit(): void {
    this.loginForm = this.formbuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit(): void {
    const loginData: LoginRequest = {
      identifier: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };
    this.loadingService.show();

    this.authService.login(loginData).subscribe({
      next: response => {
        this.authService.setToken(response.jwt);
        this.snackBar.open('Login successful');
        this.loadingService.hide();
        this.router.navigate(['user/list']);
      },
      error: error => {
        this.loadingService.hide();
        console.error(error);
        this.errorMessage = error.error.status || 'Login failed. Please check your credentials.';
      },
    });
  }
}
