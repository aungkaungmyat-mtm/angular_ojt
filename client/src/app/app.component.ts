import { Component, inject, OnInit } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterOutlet,
} from '@angular/router';
import { FooterComponent } from './shared/components/footer/footer.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { LoadingScreenComponent } from './shared/components/loading-screen/loading-screen.component';
import { LoadingService } from './shared/services/loading/loading.service';

import { AuthService } from './features/auth/services/auth.service';
import { CommonModule, NgIf } from '@angular/common';



@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoadingScreenComponent, HeaderComponent, FooterComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  isLoggedIn: boolean = false; // Store login state

  private readonly router = inject(Router);
  private readonly loadingService = inject(LoadingService);
  private readonly authService = inject(AuthService);

  ngOnInit(): void {
    this.updateLoginStatus(); // Check login status on app load

    // Check login status whenever route changes
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateLoginStatus();
      }


      if (event instanceof NavigationStart) {
        this.loadingService.show();
      } else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        this.loadingService.hide();
      }
    });
  }

  private updateLoginStatus(): void {
    this.authService.isLoggedIn().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
  }
}

