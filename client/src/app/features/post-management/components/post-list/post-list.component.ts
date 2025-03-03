import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject, QueryList, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { NgbHighlight, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { NgbdSortableHeader, SortColumn, SortDirection } from '../../directives/post.directive';
import { Post, SortEvent } from '../../interfaces/post-interfaces';
import { RelativeTimePipe } from '../../pipes/relative-time.pipe';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-post-list',
  imports: [
    CommonModule,
    NgbHighlight,
    NgbPaginationModule,
    AsyncPipe,
    FormsModule,
    MatIcon,
    RelativeTimePipe,
  ],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css',
})
export class PostListComponent {
  public readonly postService = inject(PostService);

  constructor() {
    this.sortOption = 'title_asc';
  }

  posts$: Observable<Post[]> = this.postService.posts$;
  total$: Observable<number> = this.postService.total$;
  loading$: Observable<boolean> = this.postService.loading$;

  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;

  onSort({ column, direction }: SortEvent) {
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    this.postService.sortColumn = column;
    this.postService.sortDirection = direction || 'asc';
  }

  onEdit(post: Post) {}

  onDelete(documentId: string) {
    try {
      this.postService.deletePost(documentId).subscribe({
        next: response => {
          console.log('Post deleted successfully', response);
        },
        error: error => {
          console.error('Error deleting post', error);
        },
      });
    } catch (error) {
      console.log('error', error); // This catch block is unlikely to trigger with Observables
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

  /** Getter for the current sort option in the dropdown */
  get sortOption(): string {
    if (!this.postService.sortColumn || this.postService.sortDirection === '') {
      return 'title_asc';
    } else {
      return `${this.postService.sortColumn}_${this.postService.sortDirection}`;
    }
  }

  /** Setter to update sort column and direction when the dropdown changes */
  set sortOption(value: string) {
    const [column, direction] = value.split('_');
    this.postService.sortColumn = column as SortColumn;
    this.postService.sortDirection = direction as SortDirection;
  }
}
