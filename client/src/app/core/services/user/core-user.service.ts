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

  // private async loadUser(): Promise<User | null> {
  //   try {
  //     const response = await firstValueFrom(
  //       this.http.get<User>(`${environment.apiBaseUrl}/api/users/me?populate[image]=true`)
  //     );
  //     this.userSubject.next(response); // Update the BehaviorSubject with the latest user data
  //     return response;
  //   } catch (error) {
  //     console.error('Error retrieving user', error);
  //     this.userSubject.next(null);
  //     return null;
  //   }
  // }

  public loadUser(): void {
    this.http.get<User>(`${environment.apiBaseUrl}/api/users/me?populate[image]=true`).subscribe({
      next: user => {
        this.userSubject.next(user);
        console.log('loaduser', user);
        console.log('loaduser subject', this.user$);
      },
      error: error => {
        console.error('Error retrieving user', error);
        this.userSubject.next(null);
      },
    });
  }

  updateProfile(user: User): void {
    this.http
      .put<User>(`${environment.apiBaseUrl}/api/users/me?populate[image]=true`, user)
      .pipe(
        tap(response => {
          this.userSubject.next(response);
        })
      )
      .subscribe();
  }
}
