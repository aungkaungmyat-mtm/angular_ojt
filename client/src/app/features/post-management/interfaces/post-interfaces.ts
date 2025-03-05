import { SortColumn, SortDirection } from '../directives/post.directive';

export interface PostRequest {
  data: {
    documentId?: string;
    title: string;
    content: string;
    author: string;
  };
}

export interface Post {
  id: number;
  documentId: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
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
