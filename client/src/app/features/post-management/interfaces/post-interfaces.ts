import { User } from '../../../core/interfaces/user';
import { SortColumn, SortDirection } from '../directives/post.directive';

export interface PostRequest {
  data: {
    documentId?: string;
    title: string;
    content: string;
    description: string;
    author: number;
  };
}

export interface Post {
  id: number;
  documentId: string;
  description: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  author: User;
}

export interface PostResponse {
  data: Post[];
  meta: {
    pagination: Pagination;
  };
}
export interface Pagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
}

export interface SortEvent {
  column: SortColumn;
  direction: SortDirection;
}

export interface SearchResult {
  posts: Post[];
  total: number;
}
