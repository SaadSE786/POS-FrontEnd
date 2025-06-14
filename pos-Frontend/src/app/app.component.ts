import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'pos-Frontend';

  showLoader = true;
  showMainContent = false;

  onAnimationComplete() {
    console.log('Animation completed, showing main content soon...');
  }

  onReadyToDestroy() {
    console.log('Loader ready to be destroyed');
    this.showLoader = false;
    this.showMainContent = true;
  }
}
