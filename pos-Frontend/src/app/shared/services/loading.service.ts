import { Injectable } from '@angular/core';
import { signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private _isLoading = signal(false);
 private _loadingComplete = signal(false);
  constructor() { }


  // Read-only signals
  readonly isLoading = this._isLoading.asReadonly();
  readonly loadingComplete = this._loadingComplete.asReadonly();

  startLoading() {
    this._isLoading.set(true);
    this._loadingComplete.set(false);
  }

  completeLoading() {
    this._isLoading.set(false);
    this._loadingComplete.set(true);
  }

  reset() {
    this._isLoading.set(false);
    this._loadingComplete.set(false);
  }
}
