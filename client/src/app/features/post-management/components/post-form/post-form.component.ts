import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { User } from '../../../../shared/interfaces/user';
import { LoadingService } from '../../../../shared/services/loading/loading.service';
import { SnackbarService } from '../../../../shared/services/snackbar/snackbar.service';
import { UserService } from '../../../../shared/services/user/user.service';
import { PostRequest } from '../../interfaces/post-interfaces';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-post-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './post-form.component.html',
  styleUrl: './post-form.component.css',
})
export class PostFormComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);

  private readonly postService = inject(PostService);
  private readonly loadingService = inject(LoadingService);
  private readonly snackbar = inject(SnackbarService);
  private readonly userService = inject(UserService);

  postForm: FormGroup;
  documentId: string | null = null;
  user: User | null = null;

  constructor() {
    this.documentId = this.route.snapshot.paramMap.get('documentId');
    this.postForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      content: ['', [Validators.required]],
    });
  }
  ngOnInit(): void {
    if (this.documentId) {
      this.postService.findOne(this.documentId).subscribe({
        next: response => {
          this.postForm.patchValue(response.data[0]);
        },
        error: error => {
          console.error('Error retrieving post', error);
          this.router.navigate(['/post/list']);
        },
      });
    }
    this.loadUser();
  }

  createPost(post: PostRequest): void {
    this.postService.createPost(post).subscribe({
      next: response => {
        this.loadingService.hide();
        this.snackbar.open('Post created successfully');
      },
      error: error => {
        this.loadingService.hide();
        this.snackbar.open('Error creating post' + error.error.message);
      },
      complete: () => {
        this.postService.refresh();
        this.postForm.reset();
      },
    });
  }

  editPost(post: PostRequest, documentId: string) {
    this.postService.updatePost(post, documentId).subscribe({
      next: response => {
        this.snackbar.open('Post updated successfully');
      },
      error: error => {
        this.snackbar.open('Error updating post: ' + error.error.message);
      },
      complete: () => {
        this.loadingService.hide();
        this.postService.refresh();
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
        author: this.user.id,
      },
    };
    console.log(postData);
    if (this.documentId) {
      this.editPost(postData, this.documentId);
    } else {
      this.createPost(postData);
    }
  }

  private async loadUser(): Promise<void> {
    await this.userService.getUser().then(user => {
      this.user = user;
    });
  }

  get title() {
    return this.postForm.get('title');
  }

  get content() {
    return this.postForm.get('content');
  }
}
