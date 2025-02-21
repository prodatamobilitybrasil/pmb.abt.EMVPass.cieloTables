import { ObjectId } from "mongodb";

export interface ICieloProduct extends Document {
    _id?: ObjectId;
    ProductId: number;
    ProductName: string;
    ProductType: number;
    BrandId: number;
    AllowTransactionWithContactlessCard: boolean;
    IsFinancialProduct: boolean;
    AllowOfflineAuthorizationForEMVCard: boolean;
    AllowReprintReceipt: boolean;
    AllowPrintReceipt: boolean;
    AllowOfflineAuthorizationForContactlessCard: boolean;
    AllowCancel: boolean;
    AllowUndo: boolean;
    AllowCaptureOfFirstInstallmentValue: boolean;
    AllowCaptureOfDownpaymentValue: boolean;
    AllowGuaranteeHandling: boolean;
    AllowPostdatingTheFirstInstallmentForSaleAndCDCQuery: boolean;
    AllowPostdating: boolean;
    AllowCDCSale: boolean;
    AllowFinancingByStore: boolean;
    AllowFinancingByCreditCardCompany: boolean;
    MaximumNumberOfInstallmentsWhenFinancingByCreditCardCompany: number;
    MaximumNumberOfInstallmentsWhenFinancingByStore: number;
    MaximumNumberOfinstallmentsForSaleAndCDCQuery: number;
    MinimumNumberOfInstallmentsWhenFinancingByStore: number;
    PostdatedSaleGuaranteeType: string;
    PostdatedDayCountLimit: number;
    FirstInstallmentDayCountLimit: number;
    HostFlow: number;
    CurrencyConversion: boolean;
}
