import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { RelativeTimePipe } from '../../../../shared/pipes/relative-time.pipe';
import { Post, PostResponse } from '../../interfaces/post-interfaces';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-post-detail',
  imports: [CommonModule, RelativeTimePipe],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.css',
})
export class PostDetailComponent {
  private readonly postService = inject(PostService);
  private readonly route = inject(ActivatedRoute);
  post: Post | null = null;

  private readonly documentId: string = this.route.snapshot.paramMap.get('documentId')!;

  post$: Observable<PostResponse> = this.documentId
    ? this.postService.findOne(this.documentId)
    : throwError(() => new Error('No documentId provided'));

  constructor() {
    this.post$.subscribe({
      next: response => {
        this.post = response.data[0];
      },
      error: err => console.error('Post fetch error:', err),
    });
  }
}
