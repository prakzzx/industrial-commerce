/**
 * INDXO AI / XMACH Industrial Purchase Portal
 * Package: @indxo/parent-platform-mocks
 * Description: Mock contracts for core INDXO Platform (Identity, CustomerDirectory, AssetDirectory, PaymentService, InvoiceService).
 */

export class MockIdentityContext {
  static getAuthenticatedUser(token?: string) {
    return {
      userId: 'EMP-9021',
      fullName: 'Mahesh Naik',
      email: 'mahesh.naik@indxo.ai',
      tenantId: 'TENANT-INDXO-PUNE',
      organizationName: 'INDXO AI Private Limited',
      roles: ['INTERNAL_STAFF', 'COMMERCE_ADMIN'],
      permissions: ['PURCHASE_PORTAL_READ', 'PURCHASE_PORTAL_WRITE', 'APPROVE_PO']
    };
  }
}

export class MockCustomerDirectory {
  static getCustomerProfile(tenantId: string) {
    return {
      tenantId,
      legalName: 'Apex Precision Tools & Engineering Pvt Ltd',
      tradeName: 'Apex Precision Works',
      registeredGstin: '27AABCU9603R1ZM',
      panNumber: 'AABCU9603R',
      billingAddresses: [
        {
          id: 'ADDR-BILL-01',
          companyName: 'Apex Precision Tools & Engineering Pvt Ltd',
          contactPerson: 'Mahesh Naik',
          contactPhone: '+91 98230 45678',
          addressLine1: 'Plot B-14, Chakan MIDC Industrial Area Phase II',
          city: 'Pune',
          state: 'Maharashtra',
          stateCode: '27',
          postalCode: '410501',
          gstin: '27AABCU9603R1ZM'
        }
      ],
      deliveryAddresses: [
        {
          id: 'ADDR-DEL-01',
          companyName: 'Apex Precision Tools Plant 1',
          contactPerson: 'Karthiknath B (Shop Floor Manager)',
          contactPhone: '+91 98230 45679',
          addressLine1: 'Plot B-14, Gate 2, Chakan Industrial Area',
          city: 'Pune',
          state: 'Maharashtra',
          stateCode: '27',
          postalCode: '410501'
        },
        {
          id: 'ADDR-DEL-02',
          companyName: 'Apex Precision Tools Bengaluru Assembly',
          contactPerson: 'Shivakumar HM',
          contactPhone: '+91 98450 12345',
          addressLine1: 'Plot 42, Peenya Industrial Area 2nd Stage',
          city: 'Bengaluru',
          state: 'Karnataka',
          stateCode: '29',
          postalCode: '560058'
        }
      ]
    };
  }
}

export class MockAssetDirectory {
  static getRegisteredMachines() {
    return [
      {
        machineId: 'MAC-VMC-04',
        name: 'Haas VF-2SS Vertical Machining Center',
        controller: 'Haas NGC / FANUC compatible',
        spindle: '12000 RPM BT40',
        location: 'Bay 3 - Milling Section',
        activeAlarms: ['ALM-310: APC BATTERY VOLTAGE LOW'],
        recommendedSpares: [
          { sku: 'BAT-FANUC-3V', name: 'FANUC 3V Lithium Backup Battery A06B-6114-K504', urgency: 'CRITICAL' },
          { sku: 'COL-ER32-12', name: 'ER32 High Precision Collet 12mm DIN6499', urgency: 'MAINTENANCE' }
        ]
      },
      {
        machineId: 'MAC-LATHE-02',
        name: 'Jyoti CNC Turning Center DX 200',
        controller: 'Siemens SINUMERIK 828D',
        spindle: '4000 RPM A2-6',
        location: 'Bay 1 - Turning Section',
        activeAlarms: [],
        recommendedSpares: [
          { sku: 'INS-CNMG-120408', name: 'Sandvik CoroTurn CNMG 12 04 08-PM 4325', urgency: 'TOOL_LIFE_85%' },
          { sku: 'COOL-SYNTH-20L', name: 'Blaser Swisslube B-Cool 755 Synthetic Coolant 20L', urgency: 'STOCK_LOW' }
        ]
      }
    ];
  }
}

export class MockPaymentService {
  static async createGatewayOrder(params: {
    orderId: string;
    amountInPaise: number;
    currency: string;
    idempotencyKey: string;
  }) {
    return {
      gatewayOrderId: 'order_rzp_' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      amount: params.amountInPaise,
      currency: params.currency || 'INR',
      keyId: 'rzp_test_MOCK_PLATFORM_KEY_7723',
      idempotencyValid: true
    };
  }

  static async verifyAndCaptureSignature(orderId: string, paymentId: string) {
    return {
      status: 'CAPTURED',
      paymentId: paymentId || 'pay_mock_' + Math.random().toString(36).substring(2, 8),
      orderId,
      capturedAt: new Date().toISOString()
    };
  }
}

export class MockInvoiceService {
  static async issueStatutoryTaxInvoice(orderData: {
    orderNumber: string;
    buyerGstin: string;
    totalPayable: number;
  }) {
    const fiscalYear = '2026-27';
    const randomSeq = Math.floor(1000 + Math.random() * 9000);
    const invoiceNumber = `INV/INDXO/${fiscalYear}/${randomSeq}`;
    const irnHash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';

    return {
      invoiceNumber,
      irnHash,
      pdfDownloadUrl: `/api/invoices/download/${invoiceNumber.replace(/\//g, '-')}.pdf`,
      issuedAt: new Date().toISOString()
    };
  }
}
