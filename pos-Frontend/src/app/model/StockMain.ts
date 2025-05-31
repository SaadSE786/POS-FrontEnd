import { StockDetail } from './StockDetail';
export class StockMain {
  intStid?: number;
  intCompanyId?: number;
  intPartyId?: number;
  intVrno?: number;
  intVrnoA?: number;
  dtVrDate?: Date;
  varRemarks?: string;
  intTransporterId?: number;
  varVrType?: string;
  dcDiscount?: number;
  dcDiscountAmount?: number;
  dcExpense?: number;
  dcAdditionalCharges?: number;
  dcNetAmount?: number;
  dtCreationDate?: Date;
  dtUpdationDate?: Date;
  intCreatedBy?: number;
  intUpdatedBy?: number;
  stockDetails?: StockDetail[];
}
