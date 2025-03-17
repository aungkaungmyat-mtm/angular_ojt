import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../../../core/interfaces/user';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient, private router: Router) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiBaseUrl}/api/users`);
  }

  deleteUser(id: number): Observable<User[]> {
    return this.http.delete<User[]>(`${environment.apiBaseUrl}/api/users/${id}`);
  }

  // it use in edit user profile
  // getCurrentUser():Observable<User>{
  //   return this.http.get<User>(`${USER_API}/me`);
  // }

  // getUserData(): Observable<User> {       //it use in user profile
  //   return this.http.get<User>(`${USER_API}/me?populate=image`);
  // }

  //for header image testing
  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${environment.apiBaseUrl}/api/users/me?populate[image]=true&populate[role]=true`);
  }

  editUserProfile(editData: User, id: number): Observable<User> {
    return this.http.put<User>(`${environment.apiBaseUrl}/api/users/${id}`, editData);
  }

  // Upload profile image
  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('files', file);

    return this.http.post<any>(`${environment.apiBaseUrl}/api/upload`, formData);
  }

  getUserProfileById(id: number): Observable<User> {
    return this.http.get<User>(
      `${environment.apiBaseUrl}/api/users/${id}?populate=image`
    );
  }

  closeProfile(): void {
    this.router.navigate(['/user/list']);
  }
}
