import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../../core/constants/api';
import { User } from '../../../core/interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient, private router: Router) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${API_CONFIG.baseUrl}${API_CONFIG.endPoints.user}`);
  }

  deleteUser(id: number): Observable<User[]> {
    return this.http.delete<User[]>(`${API_CONFIG.baseUrl}${API_CONFIG.endPoints.user}/${id}`);
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
    return this.http.get<User>(`${API_CONFIG.baseUrl}${API_CONFIG.endPoints.user}/me?populate=role`);
  }

  editUserProfile(editData: User, id: number): Observable<User> {
    return this.http.put<User>(`${API_CONFIG.baseUrl}${API_CONFIG.endPoints.user}/${id}`, editData);
  }

  // Upload profile image
  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('files', file);

    return this.http.post<any>('http://localhost:1337/api/upload', formData);
  }

  getUserProfileById(id: number): Observable<User> {
    return this.http.get<User>(
      `${API_CONFIG.baseUrl}${API_CONFIG.endPoints.user}/${id}`
    );
  }

  closeProfile(): void {
    this.router.navigate(['/user/list']);
  }
}
