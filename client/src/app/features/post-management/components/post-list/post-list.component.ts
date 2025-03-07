import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgbHighlight, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';

import { User } from '../../../../core/interfaces/user';
import { RelativeTimePipe } from '../../../../core/pipes/relative-time.pipe';
import { SnackbarService } from '../../../../core/services/snackbar/snackbar.service';
import { UserService } from '../../../../core/services/user/user.service';
import { NgbdSortableHeader, SortColumn, SortDirection } from '../../directives/post.directive';
import { Post, SortEvent } from '../../interfaces/post-interfaces';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-post-list',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    RelativeTimePipe,
    AsyncPipe,
    NgbHighlight,
    NgbPaginationModule,
  ],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css',
})
export class PostListComponent implements OnInit {
  private readonly snackbar = inject(SnackbarService);
  private readonly postService = inject(PostService);
  private readonly userService = inject(UserService);

  posts$: Observable<Post[]> = this.postService.posts$;
  total$: Observable<number> = this.postService.total$;
  loading$: Observable<boolean> = this.postService.loading$;
  searchTerm: string = this.postService.searchTerm;
  page: number = this.postService.page;
  pageSize: number = this.postService.pageSize;
  user: User | null = null;

  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;

  ngOnInit(): void {
    this.sortOption = 'title_asc';
    this.loadUser();
  }

  private async loadUser(): Promise<void> {
    await this.userService.getUser().then(user => {
      this.user = user;
    });
  }

  onSort({ column, direction }: SortEvent) {
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    this.postService.sortColumn = column;
    this.postService.sortDirection = direction || 'asc';
  }

  onDelete(documentId: string) {
    try {
      this.postService.deletePost(documentId);
      this.snackbar.open('Post deleted successfully');
    } catch (error) {
      console.log('error', error);
    }
  }

  onPageChange(page: number) {
    this.postService.page = page;
  }

  onPageSizeChange(pageSize: number) {
    this.postService.pageSize = pageSize;
    this.postService.page = 1;
  }

  onSearch(searchTerm: string) {
    this.postService.searchTerm = searchTerm;
  }

  getSortDirection(column: string): string {
    const header = this.headers?.find(h => h.sortable === column);
    return header?.direction ?? '';
  }

  get sortOption(): string {
    if (!this.postService.sortColumn || this.postService.sortDirection === '') {
      return 'title_asc';
    } else {
      return `${this.postService.sortColumn}_${this.postService.sortDirection}`;
    }
  }

  set sortOption(value: string) {
    const [column, direction] = value.split('_');
    this.postService.sortColumn = column as SortColumn;
    this.postService.sortDirection = direction as SortDirection;
  }
}
