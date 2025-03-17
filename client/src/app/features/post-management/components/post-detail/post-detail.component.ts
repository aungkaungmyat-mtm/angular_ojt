import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, takeUntil, throwError } from 'rxjs';
import { RelativeTimePipe } from '../../../../core/pipes/relative-time.pipe';
import { Post, PostResponse } from '../../interfaces/post-interfaces';
import { PostService } from '../../services/post.service';
import { QuillModule } from 'ngx-quill';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../../environments/environment.development';

@Component({
  selector: 'app-post-detail',
  imports: [CommonModule, RelativeTimePipe, QuillModule, FormsModule],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.css',
})
export class PostDetailComponent implements OnInit, OnDestroy {
  private readonly postService = inject(PostService);
  private readonly route = inject(ActivatedRoute);

  post: Post | null = null;
  defaultImage = 'https://th.bing.com/th/id/OIP.QOMRexd-LyIorC_N-w1bvwAAAA?rs=1&pid=ImgDetMain';
  private destroy$ = new Subject<void>();
  error: string | null = null;
  private readonly documentId: string | null = this.route.snapshot.paramMap.get('documentId');

  post$: Observable<PostResponse> = this.getPostObservable();
  private getPostObservable(): Observable<PostResponse> {
    if (!this.documentId) {
      return throwError(() => new Error('No documentId provided'));
    }
    return this.postService.findOne(this.documentId);
  }

  ngOnInit(): void {
    this.post$.pipe(takeUntil(this.destroy$)).subscribe({
      next: response => {
        this.post = response.data[0];
      },
      error: err => {
        console.error('Post fetch error:', err);
        this.error = 'Failed to load post. Please try again later.';
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getAuthorAvatarBackground(): string {
    const url = this.post?.author?.image?.url
      ? `${environment.apiBaseUrl}${this.post.author.image.url}`
      : this.defaultImage;
    return `url(${url}) center/cover`;
  }
}
