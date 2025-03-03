import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LoadingService } from '../../../../shared/services/loading.service';
import { PostRequest } from '../../interfaces/post-interfaces';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-post-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './post-form.component.html',
  styleUrl: './post-form.component.css',
})
export class PostFormComponent {
  postForm!: FormGroup;
  title!: FormControl;
  content!: FormControl;
  author!: FormControl;

  private readonly loadingService = inject(LoadingService);

  private readonly postService = inject(PostService);

  public createPost(post: PostRequest) {
    this.postService.createPost(post).subscribe({
      next: response => {
        console.log('Post created successfully', response);
      },
      error: error => {
        console.error('Error creating post', error);
      },
    });
  }

  onSubmit(): void {
    if (this.postForm.invalid) return;
    this.loadingService.show();

    const postData: PostRequest = {
      data: {
        title: this.postForm.value.title,
        content: this.postForm.value.content,
        author: this.postForm.value.author,
      },
    };
  }
}
