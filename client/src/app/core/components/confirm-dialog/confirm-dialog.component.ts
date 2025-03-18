import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-confirm-dialog',
  imports: [MatDialogContent,MatDialogActions,MatButton],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css'
})
export class ConfirmDialogComponent {
  readonly dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);

}
