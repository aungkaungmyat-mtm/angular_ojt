import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { User } from '../../../auth/interfaces/auth-interfaces';
import { UserService } from '../../services/user.service';

import { RouterLink } from '@angular/router';
import { CsvService } from '../../../../shared/services/csv/csv.service';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogService } from '../../../../core/services/confirm-dialog/confirm-dialog.service';
import { SnackbarService } from '../../../../core/services/snackbar/snackbar.service';

@Component({
  selector: 'app-userlists',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    RouterLink,
    MatDialogModule
  ],
  templateUrl: './userlists.component.html',
  styleUrl: './userlists.component.css',
})
export class UserlistsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'username', 'email', 'job', 'address'];

  dataSource: MatTableDataSource<User>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public csvService: CsvService = inject(CsvService);
  user: User | undefined;
  constructor(private readonly userService: UserService, private confirmDialogService: ConfirmDialogService, private snackbarservice: SnackbarService) {
    this.dataSource = new MatTableDataSource<User>();

  }

  ngOnInit(): void {
    this.loadUsers();
    this.userService.getCurrentUser().subscribe({
      next: data => {
        this.user = data;
        this.isAdmin();
      },
      error: err => console.error('Error fetching user:', err),
    });
  }

  isAdmin(): void {
    if (this.user?.role?.name === 'Admin') {
      this.displayedColumns.push('delete');
    }
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: data => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: err => console.error('Error fetching users:', err),
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  deleteUser(id: number) {
    this.confirmDialogService.confirm().subscribe(result => {
      if (result) {
        this.userService.deleteUser(id).subscribe({
          next: () => {
            this.snackbarservice.open('User deleted successfully');
            this.loadUsers();
          },
          error: error => alert('Error deleting user'),
        });
      }
    });
  }
  downloadUserList(): void {
    this.csvService.downloadCSV('UserList', this.dataSource.data);
  }
}
