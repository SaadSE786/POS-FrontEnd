export class Item {
  intItemId: number = 0;
  intCompanyId: number = 0;
  varItemName: string = '';
  dcOpenStock: number = 0;
  dcMinLevel: number = 0;
  dcMaxLevel: number = 0;
  dcOrderLevel: number = 0;
  dtOpenDate: Date = new Date();
  isActive: boolean = false;
  dcSellRate: number = 0;
  dcPurRate: number = 0;
  dcRetailSaleRate: number = 0;
  dcDistributorSaleRate: number = 0;
  dcDiscount: number = 0;
  isTaxable: boolean = false;
  isExpirable: boolean = false;
  varUom: string = '';
  dtExpiryDate: Date = new Date();
  dtCreationDate: Date = new Date();
  dtUpdationDate: Date = new Date();
  intCreatedBy: number = 0;
  intUpdatedBy: number = 0;
}
