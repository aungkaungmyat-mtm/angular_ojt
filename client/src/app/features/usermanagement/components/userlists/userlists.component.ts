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
    MatDialogModule,
  ],
  templateUrl: './userlists.component.html',
  styleUrl: './userlists.component.css',
})
export class UserlistsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'username', 'email', 'job', 'address', 'useraction'];

  dataSource: MatTableDataSource<User>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public csvService: CsvService = inject(CsvService);
  private snackbar = inject(SnackbarService);
  private confirmDialogService = inject(ConfirmDialogService);
  userdata: User | undefined;
  constructor(private readonly userService: UserService) {
    this.dataSource = new MatTableDataSource<User>();
  }

  ngOnInit(): void {
    this.loadUsers();
    this.userService.getCurrentUser().subscribe({
      next: data => {
        this.userdata = data;
        this.isAdmin();
      },
      error: err => {
        console.error('Error fetching user:', err);
        this.snackbar.open('Error fetching user: ' + err.error.error.message, 60000);
      },
    });
  }

  isAdmin() {
    if (this.userdata?.role?.name === 'Admin') {
      this.displayedColumns.push('adminaction');
    }
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: data => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: err => {
        console.error('Error fetching users:', err);
        this.snackbar.open('Error fetching users: ' + err.error.error.message, 60000);
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  deleteUser(id: number) {
    this.confirmDialogService
      .confirm('Are you sure you want to delete this user?')
      .subscribe(result => {
        if (result) {
          this.userService.deleteUser(id).subscribe({
            next: () => {
              this.loadUsers();
              this.snackbar.open('User deleted successfully');
            },
            error: error => {
              console.error('Error deleting user:', error);
              this.snackbar.open('Error deleting user: ' + error.error.error.message, 60000);
            },
          });
        }
      });
  }
  downloadUserList(): void {
    this.csvService.downloadCSV('UserList', this.dataSource.data);
  }
}
