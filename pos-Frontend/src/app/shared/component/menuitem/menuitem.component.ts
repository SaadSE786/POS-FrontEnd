import { Component, input, signal } from '@angular/core';
import { MenuItem } from '../sidebar/sidebar.component';
import { transition, trigger, style, animate } from '@angular/animations';

@Component({
  selector: 'app-menuitem',
  templateUrl: './menuitem.component.html',
  styleUrl: './menuitem.component.scss',
  animations: [
    trigger('expandContractMenu', [
      transition(':enter', [
        style({ opacity: 0, height: '0px' }),
        animate('500ms ease-in-out', style({ opacity: 1, height: '*' })),
      ]),
      transition(':leave', [
        animate('500ms ease-in-out', style({ opacity: 0, height: '0px' })),
      ]),
    ]),
  ],
})
export class MenuitemComponent {
  item = input.required<MenuItem>();
  collapsed = input(false);
  nestedItemOpen = signal(false);

  toggleNested() {
    if (this.item()?.children) {
      this.nestedItemOpen.set(!this.nestedItemOpen());
    }
    // this.nestedItemOpen.set(!this.nestedItemOpen());
  }
}
