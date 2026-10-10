# INDXO AI Platform Integration Guide

## 1. Separate Team Boundary
The **Purchase Portal** is an autonomous bounded module. It interacts with the parent INDXO SaaS platform through standard contracts and does not have access to production credentials, database superusers, or Keycloak signing keys.

```
+-------------------------------------------------------------+
|                INDXO Playbook / XMACH SaaS                  |
|  - Identity / Keycloak       - Statutory Invoice Service    |
|  - Payment Gateway Keys      - Customer / Machine Masters   |
+-------------------------------------------------------------+
                              |
               REST / NATS JetStream Contracts
                              |
+-----------------------------v-------------------------------+
|             INDXO Industrial Purchase Portal                |
|  - Amazon-Style B2B Web      - Vendor Sub-Order Split       |
|  - Product Catalogue & Cart  - GST Tax Estimate UI          |
|  - Machine Context Spares    - Idempotent Checkout          |
+-------------------------------------------------------------+
```

## 2. Redis Key Strategy (Section 22)
| Key Pattern | TTL | Purpose |
| :--- | :--- | :--- |
| `cart:{tenant}:{user}` | 7 Days | Session cart cache & active item storage |
| `catalog:sku:{sku}` | 1 Hour | Cached variant & technical spec cache |
| `stock:{offer}` | 60 Sec | Real-time vendor inventory balance |
| `checkout:{idempotencyKey}` | 24 Hours | Duplicate order prevention lock |
| `order:{tenant}:{order}:current`| 10 Min | Fast order status cache |
| `vendor:{vendor}:orders:summary`| 5 Min | Vendor dashboard queue metrics |

## 3. GST Calculation & Place of Supply (Section 11 & 14)
- When Buyer State Code matches Vendor/Origin State Code (`stateCode === originStateCode`):
  - **CGST**: `taxRate / 2`
  - **SGST**: `taxRate / 2`
  - **IGST**: `0%`
- When Buyer State Code differs from Vendor/Origin State Code (`stateCode !== originStateCode`):
  - **IGST**: `taxRate`
  - **CGST**: `0%`
  - **SGST**: `0%`
