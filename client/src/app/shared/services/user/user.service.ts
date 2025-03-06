import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { API_CONFIG } from '../../../core/constants/api';
import { User } from '../../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);

  constructor() {}

  private async loadUser(): Promise<User | null> {
    try {
      const response = await firstValueFrom(
        this.http.get<User>(`${API_CONFIG.baseUrl}${API_CONFIG.endPoints.user}/me`)
      );
      return response;
    } catch (error) {
      console.error('Error retrieving user', error);
      return null;
    }
  }

  public async getUser(): Promise<User | null> {
    return await this.loadUser();
  }
}
