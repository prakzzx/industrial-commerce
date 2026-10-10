-- INDXO AI / XMACH Industrial Purchase Portal
-- Migration: 001_init_purchase_portal.sql
-- Description: Bounded marketplace commerce schema for industrial consumables, spares, and tools.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(64) PRIMARY KEY,
    parent_id VARCHAR(64) REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(64),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_scope VARCHAR(64) NOT NULL,
    category_id VARCHAR(64) NOT NULL REFERENCES categories(id),
    brand VARCHAR(128) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    description TEXT,
    specification_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    machine_compatibility_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sku VARCHAR(64) NOT NULL UNIQUE,
    model VARCHAR(128) NOT NULL,
    uom VARCHAR(32) NOT NULL DEFAULT 'NOS',
    pack_size INT NOT NULL DEFAULT 1,
    attributes_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    tax_code_hsn VARCHAR(16) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
    object_key VARCHAR(512) NOT NULL,
    type VARCHAR(32) NOT NULL,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vendor_offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id VARCHAR(64) NOT NULL,
    vendor_name VARCHAR(255) NOT NULL,
    sku_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
    seller_sku VARCHAR(64),
    price NUMERIC(14, 2) NOT NULL,
    currency VARCHAR(8) NOT NULL DEFAULT 'INR',
    moq INT NOT NULL DEFAULT 1,
    lead_time_days INT NOT NULL DEFAULT 2,
    service_area_json JSONB DEFAULT '["ALL_INDIA"]'::jsonb,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inventory_balances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_offer_id UUID NOT NULL REFERENCES vendor_offers(id) ON DELETE CASCADE,
    warehouse_site_ref VARCHAR(128) NOT NULL,
    qty_available INT NOT NULL DEFAULT 0,
    qty_reserved INT NOT NULL DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS price_breaks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    offer_id UUID NOT NULL REFERENCES vendor_offers(id) ON DELETE CASCADE,
    min_qty INT NOT NULL,
    max_qty INT,
    unit_price NUMERIC(14, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS shipping_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    offer_id UUID REFERENCES vendor_offers(id) ON DELETE CASCADE,
    category_id VARCHAR(64) REFERENCES categories(id) ON DELETE SET NULL,
    weight_kg NUMERIC(8, 3) DEFAULT 0.5,
    dimensions_cm VARCHAR(64),
    freight_policy VARCHAR(64) DEFAULT 'FIXED_PER_SHIPMENT',
    base_freight_charge NUMERIC(10, 2) DEFAULT 150.00
);

CREATE TABLE IF NOT EXISTS cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id VARCHAR(64) NOT NULL,
    user_id VARCHAR(64) NOT NULL,
    vendor_offer_id UUID NOT NULL REFERENCES vendor_offers(id),
    quantity INT NOT NULL DEFAULT 1,
    is_saved_for_later BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, user_id, vendor_offer_id, is_saved_for_later)
);

CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id VARCHAR(64) NOT NULL,
    user_id VARCHAR(64) NOT NULL,
    order_number VARCHAR(64) NOT NULL UNIQUE,
    idempotency_key VARCHAR(128) NOT NULL UNIQUE,
    status VARCHAR(64) NOT NULL DEFAULT 'PAYMENT_PENDING',
    po_reference VARCHAR(128),
    cost_center VARCHAR(128),
    machine_context_id VARCHAR(128),
    subtotal_amount NUMERIC(14, 2) NOT NULL,
    freight_amount NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    cgst_amount NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    sgst_amount NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    igst_amount NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    total_tax_amount NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    total_payable_amount NUMERIC(14, 2) NOT NULL,
    payment_method VARCHAR(64) NOT NULL,
    payment_status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_address_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    type VARCHAR(32) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(128) NOT NULL,
    contact_phone VARCHAR(32) NOT NULL,
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    city VARCHAR(128) NOT NULL,
    state VARCHAR(128) NOT NULL,
    state_code VARCHAR(4) NOT NULL,
    postal_code VARCHAR(32) NOT NULL,
    gstin VARCHAR(32),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vendor_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    vendor_id VARCHAR(64) NOT NULL,
    vendor_order_number VARCHAR(64) NOT NULL UNIQUE,
    status VARCHAR(64) NOT NULL DEFAULT 'CONFIRMED',
    vendor_subtotal NUMERIC(14, 2) NOT NULL,
    vendor_freight NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    vendor_tax NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    vendor_total NUMERIC(14, 2) NOT NULL,
    estimated_dispatch_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_lines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    vendor_order_id UUID NOT NULL REFERENCES vendor_orders(id) ON DELETE CASCADE,
    sku_id UUID NOT NULL REFERENCES product_variants(id),
    sku_code VARCHAR(64) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    brand VARCHAR(128) NOT NULL,
    hsn_code VARCHAR(16) NOT NULL,
    uom VARCHAR(32) NOT NULL,
    quantity INT NOT NULL,
    unit_price NUMERIC(14, 2) NOT NULL,
    tax_rate_percent NUMERIC(5, 2) NOT NULL,
    tax_amount NUMERIC(14, 2) NOT NULL,
    line_total NUMERIC(14, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS shipments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_order_id UUID NOT NULL REFERENCES vendor_orders(id) ON DELETE CASCADE,
    carrier_type VARCHAR(64) NOT NULL,
    carrier_name VARCHAR(128),
    tracking_number VARCHAR(128),
    status VARCHAR(64) NOT NULL DEFAULT 'DISPATCHED',
    shipped_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expected_delivery_date DATE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    proof_of_delivery_key VARCHAR(512)
);

CREATE TABLE IF NOT EXISTS invoice_references (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    vendor_order_id UUID REFERENCES vendor_orders(id) ON DELETE SET NULL,
    invoice_number VARCHAR(128) NOT NULL,
    irn_hash VARCHAR(256),
    qr_code_key VARCHAR(512),
    invoice_pdf_key VARCHAR(512),
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS return_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id),
    vendor_order_id UUID NOT NULL REFERENCES vendor_orders(id),
    order_line_id UUID NOT NULL REFERENCES order_lines(id),
    reason VARCHAR(128) NOT NULL,
    item_condition VARCHAR(64) NOT NULL,
    description TEXT,
    evidence_media_keys JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(64) NOT NULL DEFAULT 'RETURN_REQUESTED',
    refund_amount NUMERIC(14, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_products_tenant_category ON products(tenant_scope, category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_variants_sku ON product_variants(sku);
CREATE INDEX IF NOT EXISTS idx_vendor_offers_sku ON vendor_offers(sku_id, active);
CREATE INDEX IF NOT EXISTS idx_orders_tenant_user ON orders(tenant_id, user_id);
CREATE INDEX IF NOT EXISTS idx_vendor_orders_vendor ON vendor_orders(vendor_id, status);
