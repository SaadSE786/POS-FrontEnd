import {
  Injectable,
  Inject,
  PLATFORM_ID,
  signal,
  computed,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

export interface JwtPayload {
  sub: string;
  email: string;
  tenant: string;
  provider: string;
  role: string;
  exp: number;
  iss: string;
  aud: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'pos_token';

  // Signals for reactive state management
  private currentUserSignal = signal<JwtPayload | null>(null);
  private tokenSignal = signal<string | null>(null);

  // Computed signals for derived state
  public currentUser = this.currentUserSignal.asReadonly();
  public isAuthenticated = computed(() => {
    const token = this.tokenSignal();
    if (!token) return false;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch {
      return false;
    }
  });

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {
    this.loadUserFromStorage();
  }

  setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.TOKEN_KEY, token);
      this.tokenSignal.set(token);
      this.decodeAndSetUser(token);
    }
  }

  getToken(): string | null {
    return this.tokenSignal();
  }

  logout(): void {
    this.clearToken();
    this.currentUserSignal.set(null);
    this.tokenSignal.set(null);
    this.router.navigate(['/auth/signin']);
  }

  private clearToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }

  private loadUserFromStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem(this.TOKEN_KEY);
      if (token) {
        this.tokenSignal.set(token);
        this.decodeAndSetUser(token);
      }
    }
  }

  private decodeAndSetUser(token: string): void {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp > currentTime) {
        this.currentUserSignal.set(decoded);
      } else {
        // Token expired
        this.logout();
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      this.logout();
    }
  }
}
