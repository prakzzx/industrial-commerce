import { IndustrialProduct, PurchaseOrder } from '../types';

const API_BASE = '/api';

export const SEED_PRODUCTS: IndustrialProduct[] = [
  {
    id: 'PROD-001',
    name: 'Sandvik CoroTurn CNMG 12 04 08-PM 4325 Carbide Insert',
    category: 'cutting_tools',
    brand: 'Sandvik',
    sku: 'INS-CNMG-120408',
    hsn: '82090010',
    uom: 'PACK of 10',
    moq: 1,
    taxRate: 18,
    description: 'Multi-material high performance turning insert for steel and cast iron with high wear resistance.',
    specifications: { 'Insert Size': 'CNMG 120408', 'Grade': 'GC4325', 'Coating': 'Inveio CVD TiCN+Al2O3', 'Rake': 'Medium Roughing' },
    compatibility: ['Jyoti CNC Turning Center DX 200', 'Haas ST-20', 'Ace Micromatic SuperJobber'],
    offers: [
      { vendorId: 'VEND-SANDVIK-DIST', vendorName: 'Apex Industrial Tooling (Authorized Sandvik)', price: 1850, leadDays: 1, stock: 120, minQty: 1, priceBreaks: [{min: 1, price: 1850}, {min: 5, price: 1720}, {min: 20, price: 1600}] },
      { vendorId: 'VEND-DIRECT-CUT', vendorName: 'DirectMach Tools Mumbai', price: 1890, leadDays: 2, stock: 45, minQty: 2 }
    ]
  },
  {
    id: 'PROD-002',
    name: 'FANUC 3V Lithium Backup Battery A06B-6114-K504',
    category: 'cnc_spares',
    brand: 'FANUC',
    sku: 'BAT-FANUC-3V',
    hsn: '85065000',
    uom: 'NOS',
    moq: 1,
    taxRate: 18,
    description: 'Genuine OEM Lithium backup battery for FANUC Alpha i/Beta i Servo Amplifiers to prevent reference position loss.',
    specifications: { 'Voltage': '3.0V', 'Chemistry': 'Lithium Poly-carbonmonofluoride', 'Connector': 'Standard FANUC 2-pin keyed' },
    compatibility: ['Haas VF-2SS Vertical Machining Center', 'FANUC 0i-MF Controller', 'FANUC 31i Controller'],
    alarmTrigger: 'ALM-310: APC BATTERY VOLTAGE LOW',
    offers: [
      { vendorId: 'VEND-FANUC-INDIA', vendorName: 'CNC Parts Direct Bengaluru', price: 2450, leadDays: 1, stock: 80, minQty: 1, priceBreaks: [{min: 1, price: 2450}, {min: 10, price: 2200}] }
    ]
  },
  {
    id: 'PROD-003',
    name: 'Blaser Swisslube B-Cool 755 Synthetic Coolant (20L Drum)',
    category: 'consumables',
    brand: 'Blaser',
    sku: 'COOL-SYNTH-20L',
    hsn: '34031900',
    uom: 'CAN 20 LTR',
    moq: 1,
    taxRate: 18,
    description: 'Water-miscible, chlorine-free semi-synthetic cutting fluid for high pressure machining and long sump life.',
    specifications: { 'Concentration': '6 - 9%', 'Refractometer Factor': '1.4', 'pH at 5%': '9.2', 'Mineral Oil': '35%' },
    compatibility: ['All CNC Milling & Turning Centers', 'Cast Iron & Titanium alloy machining'],
    offers: [
      { vendorId: 'VEND-LUBE-EXPRESS', vendorName: 'Maharshi Lubricants Chakan', price: 9200, leadDays: 2, stock: 35, minQty: 1, priceBreaks: [{min: 1, price: 9200}, {min: 5, price: 8600}] }
    ]
  },
  {
    id: 'PROD-004',
    name: 'Siemens SINAMICS S120 Motor Module 6SL3120-1TE21-8AA3',
    category: 'plc_automation',
    brand: 'Siemens',
    sku: 'SIE-SINAMICS-18A',
    hsn: '85044090',
    uom: 'NOS',
    moq: 1,
    taxRate: 18,
    description: 'Single motor module Booksize format, input 600V DC, output 400V 3AC 18A.',
    specifications: { 'Current Rating': '18 A', 'Output Power': '9.7 kW', 'Cooling': 'Internal air cooling' },
    compatibility: ['Siemens SINUMERIK 840D sl', 'Siemens 828D'],
    offers: [
      { vendorId: 'VEND-AUTOMATION-SOL', vendorName: 'Pinnacle Automation Pune', price: 78500, leadDays: 3, stock: 4, minQty: 1 }
    ]
  },
  {
    id: 'PROD-005',
    name: 'SKF High Precision Deep Groove Spindle Bearing 6205-2RSH',
    category: 'mechanical',
    brand: 'SKF',
    sku: 'BRG-SKF-6205',
    hsn: '84821011',
    uom: 'NOS',
    moq: 2,
    taxRate: 18,
    description: 'Sealed precision deep groove ball bearing with high thermal resilience for machine drive shafts.',
    specifications: { 'Bore Dia': '25 mm', 'Outer Dia': '52 mm', 'Width': '15 mm', 'Limiting Speed': '11000 r/min' },
    compatibility: ['Machine auxiliary drives', 'Pump shafts', 'Gearboxes'],
    offers: [
      { vendorId: 'VEND-BEARING-HUB', vendorName: 'National Bearing Centre', price: 420, leadDays: 1, stock: 150, minQty: 2, priceBreaks: [{min: 2, price: 420}, {min: 20, price: 380}] }
    ]
  },
  {
    id: 'PROD-006',
    name: 'Mitutoyo Digimatic Vernier Caliper 0-150mm (500-196-30)',
    category: 'quality_metrology',
    brand: 'Mitutoyo',
    sku: 'MIT-CALIPER-150',
    hsn: '90173010',
    uom: 'NOS',
    moq: 1,
    taxRate: 18,
    description: 'Industry-standard AOS electromagnetic inductive sensor digital caliper with absolute scale.',
    specifications: { 'Range': '0 - 150 mm', 'Resolution': '0.01 mm', 'Accuracy': '±0.02 mm', 'Data Output': 'Yes' },
    compatibility: ['Quality Inspection Bay', 'CMM Verification', 'Machine Setters'],
    offers: [
      { vendorId: 'VEND-METROLOGY-IND', vendorName: 'Precision Gauges & Metrology Pune', price: 6800, leadDays: 1, stock: 25, minQty: 1 }
    ]
  },
  {
    id: 'PROD-007',
    name: 'EN8 (080M40) Bright Drawn Carbon Steel Round Bar (Dia 50mm x 1000mm)',
    category: 'raw_materials',
    brand: 'Tata Steel Industrial',
    sku: 'RAW-EN8-RD50',
    hsn: '72283029',
    uom: 'BAR (15.4 KG)',
    moq: 2,
    taxRate: 18,
    description: 'Medium carbon steel bar with good tensile strength and machinability. Ideal for shafts, axles, studs, and machining blanks.',
    specifications: { 'Diameter': '50 mm ±0.05', 'Length': '1000 mm', 'Hardness': '180 - 220 HB', 'Surface Finish': 'Bright Peeled & Polished' },
    compatibility: ['All CNC Lathes & Band Saws', 'Shaft & Gear Blank Manufacturing'],
    offers: [
      { vendorId: 'VEND-STEEL-STOCK', vendorName: 'Maharashtra Steel Corp MIDC', price: 1750, leadDays: 2, stock: 95, minQty: 2, priceBreaks: [{min: 2, price: 1750}, {min: 10, price: 1620}, {min: 50, price: 1490}] },
      { vendorId: 'VEND-METALS-DIRECT', vendorName: 'Apex Alloy Metals Pune', price: 1800, leadDays: 1, stock: 40, minQty: 2 }
    ]
  },
  {
    id: 'PROD-008',
    name: 'IFM Electronic VVB001 IIoT Vibration & Temperature Sensor (IO-Link)',
    category: 'sensors_iiot',
    brand: 'IFM Electronic',
    sku: 'SEN-IFM-VVB001',
    hsn: '90318000',
    uom: 'NOS',
    moq: 1,
    taxRate: 18,
    description: 'Predictive maintenance IIoT sensor monitors v-RMS (fatigue), a-RMS (impact), temperature and crest factor on motors and spindles.',
    specifications: { 'Measurement Range': '0...25 mm/s RMS', 'Frequency Range': '2...10000 Hz', 'Interface': 'IO-Link 1.1 / 4-20mA', 'Protection': 'IP67 / IP69K' },
    compatibility: ['CNC Spindles', 'Coolant Pumps', 'Ball Screw Drives', 'XMACH Edge Gateways'],
    offers: [
      { vendorId: 'VEND-SENSORS-IND', vendorName: 'Sensors & Automation Direct', price: 14200, leadDays: 2, stock: 18, minQty: 1, priceBreaks: [{min: 1, price: 14200}, {min: 5, price: 13100}] }
    ]
  },
  {
    id: 'PROD-009',
    name: 'Schneider TeSys D 3-Pole Contactor LC1D18M7 (18A 220V AC Coil)',
    category: 'electrical',
    brand: 'Schneider Electric',
    sku: 'ELE-SCH-LC1D18',
    hsn: '85364900',
    uom: 'NOS',
    moq: 1,
    taxRate: 18,
    description: 'High-reliability motor contactor for control panels, machine coolant motors, and chip conveyors.',
    specifications: { 'Rated Operational Current': '18 A (<= 440 V AC AC-3)', 'Control Circuit': '220 V AC 50/60 Hz', 'Auxiliary Contacts': '1 NO + 1 NC' },
    compatibility: ['CNC Electrical Cabinets', 'Coolant High-Pressure Systems', 'Hydraulic Power Packs'],
    offers: [
      { vendorId: 'VEND-ELEC-DIST', vendorName: 'Indo-German Switchgears Pune', price: 1480, leadDays: 1, stock: 65, minQty: 1, priceBreaks: [{min: 1, price: 1480}, {min: 10, price: 1350}] }
    ]
  },
  {
    id: 'PROD-010',
    name: 'ER32 Precision Spring Collet Set (18 Pcs, 3mm - 20mm DIN 6499B)',
    category: 'machine_accessories',
    brand: 'Kennametal',
    sku: 'ACC-ER32-SET18',
    hsn: '84661020',
    uom: 'SET',
    moq: 1,
    taxRate: 18,
    description: 'Hardened and precision ground spring collets for CNC milling toolholders with runout under 5 microns (0.005mm).',
    specifications: { 'Standard': 'DIN 6499B / ISO 15488', 'Collet Sizes': '3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20 mm', 'Runout': '< 0.005 mm' },
    compatibility: ['BT40 ER32 Toolholders', 'BT30 ER32 Chucks', 'Haas VF-2SS', 'Makino F5'],
    offers: [
      { vendorId: 'VEND-TOOLING-SOL', vendorName: 'Apex Industrial Tooling', price: 8900, leadDays: 1, stock: 22, minQty: 1, priceBreaks: [{min: 1, price: 8900}, {min: 3, price: 8200}] }
    ]
  },
  {
    id: 'PROD-011',
    name: 'INDXO XMACH 7.5kW High-Torque Spindle Servo Retrofit Kit',
    category: 'machines_retrofit',
    brand: 'INDXO XMACH',
    sku: 'RETRO-SPINDLE-75KW',
    hsn: '85015290',
    uom: 'KIT',
    moq: 1,
    taxRate: 18,
    description: 'Complete retrofit drive panel and motor kit to convert manual knee mills or legacy CNCs to modern synchronized rigid tapping spindles.',
    specifications: { 'Motor Power': '7.5 kW (10 HP)', 'Max RPM': '8000 RPM', 'Encoder': '23-bit Optical Absolute', 'Drive Protocol': 'Modbus TCP / EtherCAT / Analog ±10V' },
    compatibility: ['Bridgeport Knee Mills', 'BFW VMC Retrofit', 'Legacy HMT Milling Machines'],
    offers: [
      { vendorId: 'VEND-RETROFIT-HUB', vendorName: 'XMACH Systems Engineering', price: 185000, leadDays: 5, stock: 3, minQty: 1 }
    ]
  }
];

export const ApiService = {
  async checkHealth(): Promise<{ status: string; module: string }> {
    try {
      const res = await fetch(`${API_BASE}/health`);
      if (res.ok) return await res.json();
    } catch {
      // Backend offline fallback
    }
    return { status: 'STANDALONE_READY', module: 'indxo-purchase-portal' };
  },

  async getProducts(query?: string, category?: string, brand?: string): Promise<IndustrialProduct[]> {
    try {
      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (category && category !== 'ALL') params.append('category', category);
      if (brand && brand !== 'ALL') params.append('brand', brand);

      const res = await fetch(`${API_BASE}/catalog/products?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data) && json.data.length > 0) {
          return json.data;
        }
      }
    } catch {
      // Fallback
    }

    // Return filtered local seed
    return SEED_PRODUCTS.filter(item => {
      const matchesCat = (!category || category === 'ALL' || item.category === category);
      const matchesBrand = (!brand || brand === 'ALL' || item.brand === brand);
      const q = (query || '').toLowerCase().trim();
      const matchesQuery = !q ||
        item.name.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.brand.toLowerCase().includes(q) ||
        item.hsn.includes(q) ||
        item.compatibility.some(c => c.toLowerCase().includes(q));
      return matchesCat && matchesBrand && matchesQuery;
    });
  },

  async validateCheckout(payload: any): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/checkout/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return { success: true, valid: true };
  },

  async submitOrder(order: PurchaseOrder): Promise<PurchaseOrder> {
    try {
      const res = await fetch(`${API_BASE}/checkout/order-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) return json.data;
      }
    } catch {
      // Fallback
    }
    return order;
  }
};
