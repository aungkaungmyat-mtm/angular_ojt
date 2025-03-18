import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {

  private dialog = inject(MatDialog);

  confirm(): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',

      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
    });

    return dialogRef.afterClosed();
  }
}
