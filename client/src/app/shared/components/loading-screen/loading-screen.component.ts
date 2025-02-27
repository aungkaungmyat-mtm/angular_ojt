import { AsyncPipe, CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable } from 'rxjs';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-loading-screen',
  imports: [MatProgressSpinnerModule, AsyncPipe, CommonModule],
  templateUrl: './loading-screen.component.html',
  styleUrl: './loading-screen.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingScreenComponent {
  loading$: Observable<boolean>;

  constructor(private loadingService: LoadingService) {
    this.loading$ = this.loadingService.loading$;
  }
}
