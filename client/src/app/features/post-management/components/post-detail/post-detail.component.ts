import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { RelativeTimePipe } from '../../../../core/pipes/relative-time.pipe';
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
  defaultImage = 'https://th.bing.com/th/id/OIP.QOMRexd-LyIorC_N-w1bvwAAAA?rs=1&pid=ImgDetMain';

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

  getAuthorAvatarBackground(): string {
    const url = this.post?.author?.image?.url
      ? `http://localhost:1337${this.post.author.image.url}`
      : this.defaultImage;
    return `url(${url}) center/cover`;
  }
}
