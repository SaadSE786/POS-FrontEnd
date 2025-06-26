import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private hasInitialLoadComplete = false;
  constructor() {}
  shouldShowLoader(): boolean {
    return !this.hasInitialLoadComplete;
  }

  markInitialLoadComplete(): void {
    this.hasInitialLoadComplete = true;
  }

  resetLoader(): void {
    this.hasInitialLoadComplete = false;
  }
}
