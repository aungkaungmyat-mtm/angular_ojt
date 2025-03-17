import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, Observable, tap } from 'rxjs';
import { User } from '../../interfaces/user';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class CoreUserService {
  private readonly http = inject(HttpClient);
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$: Observable<User | null> = this.userSubject.asObservable();

  constructor() {
    this.loadUser();
  }

  public loadUser(): void {
    this.http.get<User>(`${environment.apiBaseUrl}/api/users/me?populate[image]=true`).subscribe({
      next: user => {
        this.userSubject.next(user);
      },
      error: error => {
        console.error('Error retrieving user', error);
        this.userSubject.next(null);
      },
    });
  }
}
