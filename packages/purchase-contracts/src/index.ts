/**
 * INDXO AI / XMACH Industrial Purchase Portal
 * Package: @indxo/purchase-contracts
 * Description: Data transfer objects, domain types, and NATS JetStream event schemas.
 */

export type UserRole = 'CUSTOMER_BUYER' | 'CUSTOMER_APPROVER' | 'CUSTOMER_FINANCE' | 'INTERNAL_STAFF' | 'VENDOR' | 'VENDOR_ADMIN' | 'COMMERCE_ADMIN';

export type OrderLifecycleStatus =
  | 'CART'
  | 'CHECKOUT_PENDING'
  | 'PAYMENT_PENDING'
  | 'APPROVAL_PENDING'
  | 'CONFIRMED'
  | 'VENDOR_ACCEPTED'
  | 'PROCESSING'
  | 'PACKED'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CLOSED'
  | 'PAYMENT_FAILED'
  | 'VENDOR_REJECTED'
  | 'PARTIALLY_FULFILLED'
  | 'CANCEL_REQUESTED'
  | 'CANCELLED'
  | 'RETURN_REQUESTED'
  | 'RETURN_APPROVED'
  | 'RETURNED'
  | 'REFUND_PENDING'
  | 'REFUNDED';

export type PaymentMethod =
  | 'GATEWAY_ONLINE'
  | 'BANK_TRANSFER'
  | 'CREDIT_TERMS'
  | 'PO_APPROVAL';

export interface CategoryDto {
  id: string;
  parentId?: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

export interface PriceBreakDto {
  minQty: number;
  maxQty?: number;
  unitPrice: number;
}

export interface VendorOfferDto {
  id: string;
  vendorId: string;
  vendorName: string;
  sellerSku: string;
  price: number;
  currency: string;
  moq: number;
  leadTimeDays: number;
  qtyAvailable: number;
  priceBreaks: PriceBreakDto[];
  shippingBase: number;
}

export interface ProductVariantDto {
  id: string;
  productId: string;
  sku: string;
  model: string;
  uom: string;
  packSize: number;
  taxCodeHsn: string;
  attributes: Record<string, string>;
  offers: VendorOfferDto[];
}

export interface ProductDto {
  id: string;
  tenantScope: string;
  categoryId: string;
  categoryName: string;
  brand: string;
  productName: string;
  description: string;
  specifications: Record<string, string>;
  machineCompatibility: string[];
  variants: ProductVariantDto[];
  thumbnailUrl?: string;
}

export interface CartItemDto {
  id: string;
  offerId: string;
  productId: string;
  skuId: string;
  productName: string;
  brand: string;
  sku: string;
  vendorId: string;
  vendorName: string;
  quantity: number;
  unitPrice: number;
  moq: number;
  leadTimeDays: number;
  hsnCode: string;
  taxRatePercent: number;
  isSavedForLater: boolean;
}

export interface AddressSnapshotDto {
  type: 'BILLING' | 'DELIVERY';
  companyName: string;
  contactPerson: string;
  contactPhone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  stateCode: string;
  postalCode: string;
  gstin?: string;
}

export interface CheckoutValidateRequest {
  billingAddress: AddressSnapshotDto;
  deliveryAddress: AddressSnapshotDto;
  poReference?: string;
  costCenter?: string;
  machineReference?: string;
}

export interface CheckoutTaxBreakdown {
  subtotal: number;
  freightTotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
  grandTotal: number;
  isInterState: boolean;
}

export interface CreateOrderIntentRequest {
  idempotencyKey: string;
  billingAddress: AddressSnapshotDto;
  deliveryAddress: AddressSnapshotDto;
  paymentMethod: PaymentMethod;
  poReference?: string;
  costCenter?: string;
  machineReference?: string;
}

export interface VendorSubOrderDto {
  id: string;
  vendorId: string;
  vendorName: string;
  vendorOrderNumber: string;
  status: OrderLifecycleStatus;
  subtotal: number;
  freight: number;
  tax: number;
  total: number;
  estimatedDispatchDate?: string;
  shipment?: {
    carrierType: string;
    carrierName: string;
    trackingNumber: string;
    status: string;
    shippedAt?: string;
  };
}

export interface OrderDto {
  id: string;
  tenantId: string;
  userId: string;
  orderNumber: string;
  idempotencyKey: string;
  status: OrderLifecycleStatus;
  createdAt: string;
  poReference?: string;
  costCenter?: string;
  machineReference?: string;
  subtotalAmount: number;
  freightAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  totalTaxAmount: number;
  totalPayableAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'PENDING' | 'CAPTURED' | 'FAILED';
  billingAddress: AddressSnapshotDto;
  deliveryAddress: AddressSnapshotDto;
  vendorOrders: VendorSubOrderDto[];
  invoiceReference?: {
    invoiceNumber: string;
    irnHash?: string;
    pdfDownloadUrl: string;
    issuedAt: string;
  };
}

// ============================================================================
// NATS DOMAIN EVENT SCHEMAS (Section 21)
// ============================================================================

export interface DomainEvent<T> {
  id: string;
  source: 'purchase-portal' | 'payment-service' | 'invoice-service' | 'vendor-portal';
  timestamp: string;
  tenantId: string;
  data: T;
}

export type CartCheckedOutEvent = DomainEvent<{
  cartId: string;
  userId: string;
  itemCount: number;
  estimatedTotal: number;
}>;

export type OrderCreatedEvent = DomainEvent<{
  orderId: string;
  orderNumber: string;
  userId: string;
  totalAmount: number;
  vendorSplits: Array<{ vendorId: string; vendorOrderId: string; amount: number }>;
}>;

export type OrderConfirmedEvent = DomainEvent<{
  orderId: string;
  orderNumber: string;
  paymentMethod: PaymentMethod;
  paymentReference?: string;
}>;

export type PaymentCapturedEvent = DomainEvent<{
  paymentId: string;
  orderId: string;
  amount: number;
  currency: string;
  gatewayTransactionId: string;
}>;

export type PaymentFailedEvent = DomainEvent<{
  orderId: string;
  reason: string;
  errorCode: string;
}>;

export type VendorOrderAcceptedEvent = DomainEvent<{
  vendorOrderId: string;
  orderId: string;
  vendorId: string;
  estimatedDispatch: string;
}>;

export type ShipmentCreatedEvent = DomainEvent<{
  vendorOrderId: string;
  orderId: string;
  trackingNumber: string;
  carrier: string;
}>;

export type InvoiceIssuedEvent = DomainEvent<{
  orderId: string;
  invoiceNumber: string;
  irnHash: string;
  pdfKey: string;
}>;
