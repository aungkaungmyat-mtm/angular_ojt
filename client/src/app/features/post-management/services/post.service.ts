import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  debounceTime,
  delay,
  map,
  Observable,
  of,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { API_CONFIG } from '../../../core/constants/api';
import { handleError } from '../../../core/utils/http-utils';
import { SortColumn, SortDirection } from '../directives/post.directive';
import {
  Post,
  PostRequest,
  PostResponse,
  SearchResult,
  State,
} from '../interfaces/post-interfaces';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${API_CONFIG.baseUrl}${API_CONFIG.endPoints.posts}`;
  private readonly _loading$ = new BehaviorSubject<boolean>(true);
  private readonly _search$ = new Subject<void>();
  private readonly _posts$ = new BehaviorSubject<Post[]>([]);
  private readonly _total$ = new BehaviorSubject<number>(0);
  private readonly _state: State = {
    page: 1,
    pageSize: 4,
    searchTerm: '',
    sortColumn: '',
    sortDirection: '',
  };

  constructor() {
    this._search$
      .pipe(
        tap(() => this._loading$.next(true)),
        debounceTime(200),
        switchMap(() => this._search()),
        delay(200),
        tap(() => this._loading$.next(false))
      )
      .subscribe(result => {
        this._posts$.next(result.posts);
        this._total$.next(result.total);
      });

    this._search$.next();
  }

  private getPosts(
    page: number = 1,
    pageSize: number = API_CONFIG.defaultPageSize
  ): Observable<PostResponse> {
    // const params = {
    //   'sort[0]': 'createdAt:desc',
    //   'pagination[page]': page.toString(),
    //   'pagination[pageSize]': pageSize.toString(),
    // };

    // return this.http.get<PostResponse>(this.apiUrl, { params }).pipe(
    return this.http.get<PostResponse>(this.apiUrl).pipe(
      map(
        response =>
          ({
            data: response.data,
            meta: response.meta,
          } as PostResponse)
      ),
      catchError(handleError<PostResponse>('getPosts'))
    );
  }

  public createPost(post: PostRequest): Observable<PostResponse> {
    return this.http.post<PostResponse>(this.apiUrl, post).pipe(
      map(
        response =>
          ({
            data: response.data,
            meta: response.meta,
          } as PostResponse)
      ),
      catchError(handleError<PostResponse>('createPost'))
    );
  }

  public updatePost(post: PostRequest): Observable<PostResponse> {
    return this.http.put<PostResponse>(this.apiUrl, post).pipe(
      map(
        response =>
          ({
            data: response.data,
            meta: response.meta,
          } as PostResponse)
      ),
      catchError(handleError<PostResponse>('updatePost'))
    );
  }

  public deletePost(documentId: string): Observable<PostResponse> {
    return this.http.delete<PostResponse>(`${this.apiUrl}/${documentId}`);
  }

  private _search(): Observable<SearchResult> {
    const { sortColumn, sortDirection, pageSize, page, searchTerm } = this._state;

    return this.getPosts().pipe(
      map(response => response.data),
      switchMap(posts => {
        let filteredPosts = sort(posts, sortColumn, sortDirection);

        filteredPosts = filteredPosts.filter(post => matches(post, searchTerm));
        const total = filteredPosts.length;

        filteredPosts = filteredPosts.slice(
          (page - 1) * pageSize,
          (page - 1) * pageSize + pageSize
        );

        return of({ posts: filteredPosts, total });
      })
    );
  }

  get posts$(): Observable<Post[]> {
    return this._posts$.asObservable();
  }

  get total$(): Observable<number> {
    return this._total$.asObservable();
  }

  get loading$(): Observable<boolean> {
    return this._loading$.asObservable();
  }

  get page(): number {
    return this._state.page;
  }

  get pageSize(): number {
    return this._state.pageSize;
  }

  get searchTerm(): string {
    return this._state.searchTerm;
  }

  get sortColumn(): SortColumn {
    return this._state.sortColumn;
  }

  get sortDirection(): string {
    return this._state.sortDirection;
  }

  // State setters
  set page(page: number) {
    this._set({ page });
  }

  set pageSize(pageSize: number) {
    this._set({ pageSize });
  }

  set searchTerm(searchTerm: string) {
    this._set({ searchTerm });
  }

  set sortColumn(sortColumn: SortColumn) {
    this._set({ sortColumn });
  }

  set sortDirection(sortDirection: SortDirection) {
    this._set({ sortDirection });
  }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }
}

const compare = (v1: string | number, v2: string | number) => (v1 < v2 ? -1 : v1 > v2 ? 1 : 0);

function matches(post: Post, term: string) {
  return (
    post.title.toLowerCase().includes(term.toLowerCase()) ||
    post.author.toLowerCase().includes(term.toLowerCase())
  );
}

function sort(posts: Post[], column: SortColumn, direction: string): Post[] {
  if (direction === '' || column === '') {
    return posts;
  } else {
    return [...posts].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}
