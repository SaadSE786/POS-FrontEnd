import { Component, Input, OnInit, signal } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';

// export interface MenuNode {
//   name: string;
//   link?: string;
//   children?: MenuNode[];
// }

export type MenuItem = {
  icon: string;
  label: string;
  route?: string;
  children?: MenuItem[];
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  sideNavCollapsed = signal(false);
  @Input() set collapsed(val: boolean) {
    this.sideNavCollapsed.set(val);
  }
  menuItems = signal<MenuItem[]>([
    {
      icon: 'dashboard',
      label: 'Dashboard',
      route: 'dashboard'
    },
    {
      icon: 'display_settings',
      label: 'Setup',
      route: 'setup',
      children: [
        {
          icon: 'account_balance',
          label: 'Chart Of Account',
          route: 'chartOfAccount'
        },
        {
          icon: 'category',
          label: 'Add Item',
          route: 'addItem'
        },
        {
          icon: 'warehouse',
          label: 'Add Warehouse',
          route: 'addWarehouse'
        },
        {
          icon: 'local_shipping',
          label: 'Add Transporter',
          route: 'addTransporter'
        }
      ]
    },
    {
      icon: 'add_shopping_cart',
      label: 'Purchase',
      route: 'content',
      children: [
        {
          icon: 'receipt_long',
          label: 'Purchase Order Voucher',
          route: 'purchaseOrderVoucher'
        },
        {
          icon: 'assignment',
          label: 'Purchase Voucher',
          route: 'purchaseVoucher'
        },
        {
          icon: 'assignment_return',
          label: 'Purchase Return Voucher',
          route: 'purchaseReturnVoucher'
        },
        {
          icon: 'assessment',
          label: 'Purchase Order Report',
          route: 'purchaseOrderReport'
        },
        {
          icon: 'analytics',
          label: 'Purchase Report',
          route: 'purchaseReport'
        },
        {
          icon: 'description',
          label: 'Purchase Return Report',
          route: 'purchaseReturnReport'
        }
      ]
    },
    {
      icon: 'shopping_cart_checkout',
      label: 'Sale',
      route: 'sale'
    },
    {
      icon: 'comments',
      label: 'Comments',
      route: 'comments'
    }
  ]);
  ngOnInit(): void {

  }
}
