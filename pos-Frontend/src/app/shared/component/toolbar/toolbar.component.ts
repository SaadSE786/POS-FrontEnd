import { Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {
  collapsed = signal(false);
  sideNavWidth = computed(() => this.collapsed() ? '65px' : '300px');
}
