import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { API_CONFIG } from '../../../../core/constants/api';
import { User } from '../../../../shared/interfaces/user';
import { LoadingService } from '../../../../shared/services/loading/loading.service';
import { SnackbarService } from '../../../../shared/services/snackbar/snackbar.service';
import { Post, PostRequest } from '../../interfaces/post-interfaces';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-post-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './post-form.component.html',
  styleUrl: './post-form.component.css',
})
export class PostFormComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly formBuilder = inject(FormBuilder);
  private readonly http = inject(HttpClient);

  private readonly postService = inject(PostService);
  private readonly loadingService = inject(LoadingService);
  private readonly snackbar = inject(SnackbarService);

  postForm: FormGroup;
  documentId: string | null = null;
  post: Post | null = null;
  user: User | null = null;
  message: string = '';

  constructor() {
    this.documentId = this.route.snapshot.paramMap.get('documentId');
    if (this.documentId) {
      this.postService.findOne(this.documentId).subscribe({
        next: response => (this.post = response.data[0]),
        error: error => console.error('Error retrieving post', error),
      });
    }

    this.postForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      content: ['', [Validators.required]],
    });
    this.loadUser();
  }

  createPost(post: PostRequest): void {
    this.postService.createPost(post).subscribe({
      next: response => {
        this.message = 'Post created successfully';
        console.log('Post created successfully', response);
      },
      error: error => {
        this.message = 'Error creating post';
        console.error('Error creating post', error);
      },
      complete: () => {
        this.loadingService.hide();
        this.postService.refresh();
        this.postForm.reset();
        this.snackbar.open(this.message);
      },
    });
  }

  editPost(post: PostRequest, documentId: string) {
    console.log('post', post);
    this.postService.updatePost(post, documentId).subscribe({
      next: response => {
        this.message = 'Post updated successfully';
        console.log('Post updated successfully', response);
      },
      error: error => {
        this.message = 'Error updating post';
        console.error('Error updating post', error);
      },
      complete: () => {
        this.loadingService.hide();
        this.postService.refresh();
        this.snackbar.open(this.message);
      },
    });
  }

  onSubmit(): void {
    if (this.postForm.invalid) return;
    if (this.user === null) {
      this.snackbar.open('Please login to create a post');
      return;
    }
    this.loadingService.show();
    const postData: PostRequest = {
      data: {
        title: this.postForm.value.title,
        content: this.postForm.value.content,
        author: this.user.username,
      },
    };

    if (this.documentId) {
      this.editPost(postData, this.documentId);
    } else {
      this.createPost(postData);
    }
  }

  private loadUser(): void {
    this.http.get<User>(`${API_CONFIG.baseUrl}${API_CONFIG.endPoints.user}/me`).subscribe({
      next: (response: User) => {
        this.user = response;
        console.log('User retrieved successfully', response);
      },
      error: error => {
        console.error('Error retrieving user', error);
      },
    });
  }

  get title() {
    return this.postForm.get('title');
  }

  get content() {
    return this.postForm.get('content');
  }
}
