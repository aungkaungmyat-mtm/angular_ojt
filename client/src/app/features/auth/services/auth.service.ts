import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { API_CONFIG } from '../../../core/constants/api';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  resetPasswordRequest,
} from '../interfaces/auth-interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'token';

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: string) {}

  register(user: RegisterRequest): Observable<RegisterResponse> {
    this.clearToken();
    return this.http.post<RegisterResponse>(`${API_CONFIG.baseUrl}/auth/local/register`, user).pipe(
      tap(response => {
        const token = response.jwt;
        this.setToken(token);
      })
    );
  }

  login(user: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${API_CONFIG.baseUrl}/auth/local`, user).pipe(
      tap(response => {
        const token = response.jwt;
        this.setToken(token);
      })
    );
  }

  isLoggedIn(): Observable<boolean> {
    if (!isPlatformBrowser(this.platformId)) {
      return of(false);
    }

    const token = this.getToken();
    if (!token) {
      return of(false);
    }

    if (this.isTokenExpired(token)) {
      this.logout();
      return of(false);
    }

    return this.verifyToken(token).pipe(
      map(isValid => isValid),
      catchError(() => of(false))
    );
  }

  private verifyToken(token: string): Observable<boolean> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${API_CONFIG.baseUrl}/users/me`, { headers }).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = jwtDecode(token);
      if (!payload || typeof payload.exp !== 'number') return true;
      const expiryDate = new Date(payload.exp * 1000);
      return expiryDate < new Date();
    } catch (error) {
      console.error('Invalid Token: ', error);
      return true;
    }
  }

  getToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.setItem(this.tokenKey, token);
  }

  clearToken(): void {
    if (isPlatformBrowser(this.platformId)) localStorage.removeItem(this.tokenKey);
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) this.clearToken();
    alert('You have been logged out');
  }

  forgotPassword(email: string): Observable<any> {
    // return this.http.post<any>(`${API_URL}/api/auth/forgot-password`, { email });
    return this.http.post<any>(`${API_CONFIG.baseUrl}/auth/forgot-password`, { email });

  }

  resetPassword(resetPasswordRequest: resetPasswordRequest): Observable<resetPasswordRequest> {
    return this.http.post<resetPasswordRequest>(`${API_CONFIG.baseUrl}/auth/reset-password`, resetPasswordRequest);

  }
}



