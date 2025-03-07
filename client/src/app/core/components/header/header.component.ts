import { NgClass } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';
import { UserService } from '../../../features/usermanagement/services/user.service';
import { LoadingService } from '../../services/loading/loading.service';
import { SnackbarService } from '../../services/snackbar/snackbar.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [NgClass, RouterLink],
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  isMenuOpen = false;
  isScrolled = false;

  private readonly loadingService = inject(LoadingService);
  private readonly snackBar = inject(SnackbarService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);

  user: any = null;
  defaultImage = 'https://th.bing.com/th/id/OIP.QOMRexd-LyIorC_N-w1bvwAAAA?rs=1&pid=ImgDetMain';

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }
  isDropdownOpen = false;

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: user => {
        this.user = user;
      },
      error: error => {
        console.error('Error fetching user:', error);
      },
    });
  }

  getUserImage(): string {
    return this.user?.image?.url
      ? `http://localhost:1337${this.user.image.url}` // If user has an image
      : this.defaultImage; // If user has no image, show default
  }

  toggleDropdown(event: MouseEvent): void {
    event.preventDefault();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  LOGOUT(): void {
    this.loadingService.show();
    try {
      this.authService.logout();
      this.loadingService.hide();
      this.router.navigate(['/auth/login']);
      this.snackBar.open('Logged out successfully');
    } catch (error) {
      console.error(error);
      this.loadingService.hide();
    }
  }
}
