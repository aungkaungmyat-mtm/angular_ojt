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
import { LoadingService } from '../../../../core/services/loading/loading.service';
import { CsvService } from '../../../../shared/services/csv/csv.service';
// import { RouterLink } from '@angular/router';

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
  constructor(
    private readonly userService: UserService,
    private readonly loadingService: LoadingService
  ) {
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

    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          alert('User deleted successfully');
          this.loadUsers();
        },
        error: error => alert('Error deleting user'),
      });
    }
  }
  downloadUserList(): void {
    this.csvService.downloadCSV('UserList', this.dataSource.data);
  }
}
