// Full role set per INDXO XMACH Industrial Purchase Portal Architecture Design, Section 6 (User Roles).
// STAFF / CUSTOMER are retained as legacy aliases so existing accounts keep working.
export type RoleType =
  | 'STAFF'
  | 'CUSTOMER'
  | 'CUSTOMER_BUYER'
  | 'CUSTOMER_APPROVER'
  | 'CUSTOMER_FINANCE'
  | 'VENDOR'
  | 'VENDOR_ADMIN'
  | 'COMMERCE_ADMIN'
  | 'PLATFORM_ADMIN';

export const ROLE_GROUP = {
  CUSTOMER: ['CUSTOMER', 'CUSTOMER_BUYER', 'CUSTOMER_APPROVER', 'CUSTOMER_FINANCE'] as RoleType[],
  VENDOR: ['VENDOR', 'VENDOR_ADMIN'] as RoleType[],
  ADMIN: ['STAFF', 'COMMERCE_ADMIN'] as RoleType[],
  PLATFORM: ['PLATFORM_ADMIN'] as RoleType[]
};

export const isCustomerRole = (role: RoleType) => ROLE_GROUP.CUSTOMER.includes(role);
export const isVendorRole = (role: RoleType) => ROLE_GROUP.VENDOR.includes(role);
export const isCommerceAdminRole = (role: RoleType) => ROLE_GROUP.ADMIN.includes(role);
export const isPlatformAdminRole = (role: RoleType) => ROLE_GROUP.PLATFORM.includes(role);

export const ROLE_LABELS: Record<RoleType, string> = {
  STAFF: 'Internal Staff (Commerce Admin)',
  CUSTOMER: 'Customer Buyer',
  CUSTOMER_BUYER: 'Customer Buyer',
  CUSTOMER_APPROVER: 'Customer Approver',
  CUSTOMER_FINANCE: 'Customer Finance',
  VENDOR: 'Vendor',
  VENDOR_ADMIN: 'Vendor Admin',
  COMMERCE_ADMIN: 'INDXO Commerce Admin',
  PLATFORM_ADMIN: 'Platform Super Admin'
};

export const ROLE_CAPABILITIES: Record<RoleType, string> = {
  STAFF: 'Categories, product approvals, vendor approvals, order interventions, return/dispute handling',
  CUSTOMER: 'Browse, cart, checkout, pay, track, reorder, request return',
  CUSTOMER_BUYER: 'Browse, cart, checkout, pay, track, reorder, request return',
  CUSTOMER_APPROVER: 'Approve high-value carts/orders, validate PO reference/credit purchase',
  CUSTOMER_FINANCE: 'Manage billing/GST profile, invoice access, payment status',
  VENDOR: 'Manage catalogue entries assigned to vendor, stock, price requests, fulfilment, shipment status',
  VENDOR_ADMIN: 'Users, service areas, inventory feeds, tax/commercial data permitted by platform',
  COMMERCE_ADMIN: 'Categories, product approvals, vendor approvals, order interventions, return/dispute handling',
  PLATFORM_ADMIN: 'Tenant access, AMC/payment/feature entitlement, global controls; remains outside module'
};

export interface UserAccount {
  userId: string;
  fullName: string;
  role: RoleType;
  company: string;
  gstin?: string;
  password?: string;
  grade?: string;
  email?: string;
}

export interface PriceBreak {
  min: number;
  price: number;
}

export interface VendorOffer {
  vendorId: string;
  vendorName: string;
  price: number;
  currency?: string;
  leadDays: number;
  stock: number;
  minQty: number;
  priceBreaks?: PriceBreak[];
}

export interface IndustrialProduct {
  id: string;
  name: string;
  category: string;
  brand: string;
  sku: string;
  hsn: string;
  uom: string;
  moq: number;
  taxRate: number;
  description: string;
  specifications?: Record<string, string>;
  compatibility: string[];
  alarmTrigger?: string;
  offers: VendorOffer[];
}

export interface CartItem {
  productId: string;
  name: string;
  brand: string;
  sku: string;
  hsn: string;
  uom: string;
  vendorId: string;
  vendorName: string;
  unitPrice: number;
  taxRate: number;
  leadDays: number;
  quantity: number;
  minQty: number;
}

export interface AddressSnapshot {
  id?: string;
  type: 'BILLING' | 'DELIVERY';
  companyName: string;
  contactPerson: string;
  contactPhone: string;
  addressLine1: string;
  city: string;
  state: string;
  stateCode: string;
  postalCode: string;
  gstin?: string;
}

export interface GstBillingProfile {
  id: string;
  legalBusinessName: string;
  gstin: string;
  placeOfSupplyState: string;
  stateCode: string;
  registrationType: 'REGULAR' | 'COMPOSITION' | 'UNREGISTERED';
  isDefault: boolean;
}

export interface VendorSubOrder {
  vendorId: string;
  vendorName: string;
  status: string;
  carrier: string;
  trackingNo: string;
  subtotal?: number;
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  idempotencyKey: string;
  date: string;
  status: 'CONFIRMED' | 'VENDOR_ACCEPTED' | 'PROCESSING' | 'PACKED' | 'SHIPPED' | 'DELIVERED';
  paymentStatus: 'PENDING' | 'CAPTURED' | 'FAILED';
  paymentMethod: string;
  poRef?: string;
  costCenter?: string;
  machineRef?: string;
  subtotal: number;
  freight: number;
  totalTax: number;
  totalPayable: number;
  cgst: number;
  sgst: number;
  igst: number;
  items: CartItem[];
  vendorSplits: VendorSubOrder[];
}
