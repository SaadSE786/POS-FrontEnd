import {
  Component,
  OnInit,
  Inject,
  signal,
  computed,
  effect,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { LoaderService } from './global-services/loader/loader.service';
import { AuthService } from './shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'pos-Frontend';

  // Local signals
  private showLoaderSignal = signal(false);
  private isInitializingSignal = signal(true);

  // Computed signals for template
  public showLoader = this.showLoaderSignal.asReadonly();
  public isInitializing = this.isInitializingSignal.asReadonly();
  public isAuthenticated = this.authService.isAuthenticated;

  // Computed signal for layout decisions
  public shouldShowDashboard = computed(
    () => this.isAuthenticated() && !this.isInitializing()
  );

  public shouldShowAuth = computed(
    () =>
      !this.isAuthenticated() && !this.showLoader() && !this.isInitializing()
  );

  public shouldShowLoader = computed(
    () => this.showLoader() && this.isInitializing()
  );

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private loaderService: LoaderService,
    private authService: AuthService,
    private router: Router
  ) {
    // Effect to react to authentication changes
    effect(() => {
      const isAuth = this.isAuthenticated();
      const currentUrl = this.router.url;

      if (isAuth) {
        // User is authenticated
        this.isInitializingSignal.set(false);
        this.showLoaderSignal.set(false);

        // Redirect from auth routes to dashboard
        if (currentUrl.includes('/auth/')) {
          this.router.navigate(['/dashboard']);
        }
      } else {
        // User is not authenticated
        this.handleUnauthenticatedUser();
      }
    });
  }

  ngOnInit(): void {
    // Initial setup - the effect will handle the rest
    this.checkInitialState();
  }

  private checkInitialState(): void {
    const shouldShowInitialLoader = this.loaderService.shouldShowLoader();

    if (!this.isAuthenticated() && shouldShowInitialLoader) {
      this.showLoaderSignal.set(true);
      setTimeout(() => {
        this.startHideLoader();
      }, 2000);
    } else {
      this.isInitializingSignal.set(false);
    }
  }

  private handleUnauthenticatedUser(): void {
    const currentUrl = this.router.url;

    if (!currentUrl.includes('/auth/') && !this.showLoader()) {
      this.router.navigate(['/auth/signin']);
    }
  }

  startHideLoader(): void {
    setTimeout(() => {
      this.onReadyToDestroy();
    }, 500);
  }

  onReadyToDestroy(): void {
    this.showLoaderSignal.set(false);
    this.isInitializingSignal.set(false);
    this.loaderService.markInitialLoadComplete();

    this.router.navigate(['/auth/signin']);

    if (this.document?.body) {
      this.document.body.style.overflow = 'auto';
      this.document.body.style.position = 'static';
    }
  }
}
