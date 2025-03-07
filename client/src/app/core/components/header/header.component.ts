import { NgClass } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import {  Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';
import { UserService } from '../../../features/usermanagement/services/user.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [ NgClass,RouterLink],
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isMenuOpen = false;
  isScrolled = false;

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

  constructor(private authService: AuthService, private router:Router, private userService: UserService) { }

  ngOnInit(): void {

    this.userService.getCurrentUser().subscribe(
      {
        next: (user) => {
          this.user = user;
        },
        error: (error) => {
          console.error('Error fetching user:', error);
        }
      }
    );
  }

  getUserImage(): string {
    return this.user?.image?.url
      ? `http://localhost:1337${this.user.image.url}`            // If user has an image
      : this.defaultImage;                                       // If user has no image, show default
  }

  toggleDropdown(event: MouseEvent): void {
    event.preventDefault();
    this.isDropdownOpen = !this.isDropdownOpen;
  }



  LOGOUT(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);

  }
}
