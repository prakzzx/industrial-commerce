# NATS JetStream Event Schema Reference

This document defines the contract for domain events emitted and consumed by the **INDXO XMACH Industrial Purchase Portal** as outlined in Section 21 of the specification.

## Core Events

### 1. `cart.checked_out`
- **Producer**: Purchase Portal
- **Consumers**: Analytics, Audit Log
- **Payload**:
```json
{
  "cartId": "uuid",
  "tenantId": "TENANT-INDXO-PUNE",
  "userId": "EMP-9021",
  "itemCount": 4,
  "estimatedSubtotal": 24500.00,
  "timestamp": "2026-09-02T10:15:30Z"
}
```

### 2. `order.created`
- **Producer**: Purchase Portal
- **Consumers**: Vendor Fulfilment Service, Notification Service
- **Payload**:
```json
{
  "orderId": "uuid",
  "orderNumber": "ORD-2026-90812",
  "tenantId": "TENANT-INDXO-PUNE",
  "userId": "EMP-9021",
  "totalPayable": 28910.00,
  "vendorSplits": [
    { "vendorId": "VEND-SANDVIK", "vendorOrderId": "uuid-1", "amount": 18500.00 },
    { "vendorId": "VEND-FANUC-IND", "vendorOrderId": "uuid-2", "amount": 10410.00 }
  ]
}
```

### 3. `payment.captured`
- **Producer**: Parent `PaymentService`
- **Consumers**: Purchase Portal Order Confirmation
- **Payload**:
```json
{
  "orderId": "uuid",
  "paymentId": "pay_rzp_991823",
  "amountInPaise": 2891000,
  "currency": "INR",
  "gatewaySignature": "verified",
  "timestamp": "2026-09-02T10:17:00Z"
}
```

### 4. `vendor_order.accepted`
- **Producer**: Vendor Portal
- **Consumers**: Purchase Portal, Customer Notification
- **Payload**:
```json
{
  "vendorOrderId": "uuid-1",
  "orderId": "uuid",
  "vendorId": "VEND-SANDVIK",
  "estimatedDispatch": "2026-09-04T18:00:00Z"
}
```

### 5. `shipment.created`
- **Producer**: Vendor Fulfilment Service
- **Consumers**: Customer Notification, Tracking Engine
- **Payload**:
```json
{
  "vendorOrderId": "uuid-1",
  "carrierType": "COURIER",
  "carrierName": "BlueDart Express",
  "trackingNumber": "BLUEDART-88291038",
  "dispatchedAt": "2026-09-04T11:20:00Z"
}
```

### 6. `invoice.issued`
- **Producer**: Parent `InvoiceService`
- **Consumers**: Purchase Portal, Finance Module
- **Payload**:
```json
{
  "orderId": "uuid",
  "invoiceNumber": "INV/INDXO/2026-27/4109",
  "irnHash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "pdfDownloadUrl": "/api/invoices/download/INV-INDXO-2026-27-4109.pdf"
}
```
