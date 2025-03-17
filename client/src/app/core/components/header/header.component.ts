import { CommonModule, NgClass } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment.development';
import { AuthService } from '../../../features/auth/services/auth.service';
import { LoadingService } from '../../services/loading/loading.service';
import { SnackbarService } from '../../services/snackbar/snackbar.service';
import { CoreUserService } from '../../services/user/core-user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [NgClass, RouterLink, CommonModule],
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  isMenuOpen = false;
  isScrolled = false;

  private readonly loadingService = inject(LoadingService);
  private readonly snackBar = inject(SnackbarService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly coreUserService = inject(CoreUserService);

  apiUrl = environment.apiBaseUrl;
  user$ = this.coreUserService.user$;
  defaultImage = 'https://th.bing.com/th/id/OIP.QOMRexd-LyIorC_N-w1bvwAAAA?rs=1&pid=ImgDetMain';

  constructor() {
    this.coreUserService.loadUser();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }
  isDropdownOpen = false;

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
      this.snackBar.open('Failed to log out. Please try again.');
    }
  }
}
