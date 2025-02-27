import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { catchError, map, Observable, of } from 'rxjs';
import { API_URL } from '../../../core/constants/api';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: string) {}

  register(user: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${API_URL}/api/auth/local/register`, user);
  }

  login(user: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${API_URL}/api/auth/local`, user);
  }

  isLoggedIn(): Observable<boolean> {
    if (!isPlatformBrowser(this.platformId)) {
      return of(false);
    }
    const token = localStorage.getItem('token');
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
    return this.http.get(`${API_URL}/api/users/me`, { headers }).pipe(
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

  logout(): void {
    if (isPlatformBrowser(this.platformId)) localStorage.removeItem('token');
  }
}
