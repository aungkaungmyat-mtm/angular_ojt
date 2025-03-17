import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  debounceTime,
  delay,
  map,
  Observable,
  shareReplay,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { handleError } from '../../../core/utils/http-utils';
import { SortColumn, SortDirection } from '../directives/post.directive';
import {
  Post,
  PostRequest,
  PostResponse,
  SearchResult,
  State,
} from '../interfaces/post-interfaces';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private readonly http = inject(HttpClient);
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

  // Cache for all posts
  private postsCache$!: Observable<Post[]>;
  // Cache expiration time (e.g., 5 minutes)
  private readonly CACHE_DURATION = 5 * 60 * 1000;
  private cacheTimestamp: number = 0;

  constructor() {
    this.initializeSearch();
  }

  private initializeSearch(): void {
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

  private getPostsFromApi(): Observable<PostResponse> {
    return this.http
      .get<PostResponse>(`${environment.apiBaseUrl}/api/posts?populate=*`)
      .pipe(
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

  private getCachedPosts(): Observable<Post[]> {
    const now = Date.now();
    const isCacheExpired = now - this.cacheTimestamp > this.CACHE_DURATION;

    if (!this.postsCache$ || isCacheExpired) {
      this.postsCache$ = this.getPostsFromApi().pipe(
        map(response => response.data),
        tap(() => (this.cacheTimestamp = now)),
        shareReplay(1) // Cache the last emitted value
      );
    }
    return this.postsCache$;
  }

  public findOne(documentId: string): Observable<PostResponse> {
    return this.http
      .get<PostResponse>(
        `${environment.apiBaseUrl}/api/posts/${documentId}?populate[author][populate]=*`
      )
      .pipe(
        map(
          response =>
            ({
              data: Array.isArray(response.data) ? response.data : [response.data],
              meta: response.meta,
            } as PostResponse)
        ),
        catchError(handleError<PostResponse>('findOne'))
      );
  }

  public createPost(post: PostRequest): Observable<PostResponse> {
    return this.http
      .post<PostResponse>(`${environment.apiBaseUrl}/api/posts`, post)
      .pipe(
        tap(() => this.invalidateCache()),
        catchError(handleError<PostResponse>('createPost'))
      );
  }

  public updatePost(post: PostRequest, documentId: string): Observable<PostResponse> {
    return this.http
      .put<PostResponse>(`${environment.apiBaseUrl}/api/posts/${documentId}`, post)
      .pipe(
        tap(() => this.invalidateCache()),
        catchError(handleError<PostResponse>('updatePost'))
      );
  }

  public deletePost(documentId: string): void {
    this.http
      .delete<PostResponse>(`${environment.apiBaseUrl}/api/posts/${documentId}`)
      .subscribe({
        next: () => {
          this.invalidateCache();
          this.refresh();
        },
        error: error => console.error('Error deleting post', error),
      });
  }

  private _search(): Observable<SearchResult> {
    const { sortColumn, sortDirection, pageSize, page, searchTerm } = this._state;

    return this.getCachedPosts().pipe(
      map(posts => {
        let filteredPosts = this.sortPosts(posts, sortColumn, sortDirection);
        filteredPosts = this.filterPosts(filteredPosts, searchTerm);
        const total = filteredPosts.length;

        const paginatedPosts = this.paginatePosts(filteredPosts, page, pageSize);

        return { posts: paginatedPosts, total };
      })
    );
  }

  private filterPosts(posts: Post[], searchTerm: string): Post[] {
    return posts.filter(post => matches(post, searchTerm));
  }

  private sortPosts(posts: Post[], column: SortColumn, direction: string): Post[] {
    return sort(posts, column, direction);
  }

  private paginatePosts(posts: Post[], page: number, pageSize: number): Post[] {
    return posts.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
  }

  invalidateCache(): void {
    this.postsCache$ = null as any;
    this.cacheTimestamp = 0;
  }

  public refresh(): void {
    this._search$.next();
  }

  // Getters
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

  // Setters
  private _set(patch: Partial<State>): void {
    Object.assign(this._state, patch);
    this._search$.next();
  }

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
}

// Keep the helper functions outside the class
const compare = (v1: string | number, v2: string | number) => (v1 < v2 ? -1 : v1 > v2 ? 1 : 0);

function matches(post: Post, term: string): boolean {
  return (
    post.title.toLowerCase().includes(term.toLowerCase()) ||
    post.author.username.toLowerCase().includes(term.toLowerCase())
  );
}

function sort(posts: Post[], column: SortColumn, direction: string): Post[] {
  if (direction === '' || column === '') {
    return posts;
  } else {
    return [...posts].sort((a, b) => {
      if (column === 'title') {
        return direction === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }
      if (column === 'author') {
        return direction === 'asc'
          ? a.author.username.localeCompare(b.author.username)
          : b.author.username.localeCompare(a.author.username);
      }
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}
