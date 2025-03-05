import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private readonly snackbar = inject(MatSnackBar);

  constructor() {}

  open(message: string) {
    this.snackbar.open(message, 'Close', {
      duration: 3000,
    });
  }
}
