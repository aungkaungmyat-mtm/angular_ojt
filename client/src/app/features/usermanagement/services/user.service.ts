import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { USER_API } from '../../../core/constants/api';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../auth/interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(USER_API);
  }

  deleteUser(id: number): Observable<User[]> {
    return this.http.delete<User[]>(`${USER_API}/${id}`);
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
    return this.http.get<User>(`${USER_API}/me?populate=*`);
  }



  editUserProfile(editData: User, id: number): Observable<User> {
    return this.http.put<User>(`${USER_API}/${id}`, editData);
  }

  // Upload profile image
  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('files', file);

    return this.http.post<any>('http://localhost:1337/api/upload', formData);
  }
}
