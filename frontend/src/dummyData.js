
export const dummyUsers = [
  {
    id: 1,
    name: 'Admin Abadi Motor',
    username: 'admin',
    password: 'admin123',
    role: 'admin'
  },
  {
    id: 2,
    name: 'Pemilik Abadi Motor',
    username: 'pemilik',
    password: 'pemilik123',
    role: 'pemilik'
  }
];

export const initialSpareParts = [
  {
    id: 1,
    code: 'AHM-KVY-001',
    name: 'V-Belt Honda Beat',
    category: 'Transmisi',
    unit: 'Pcs',
    stock: 12,
    description: 'V-Belt untuk Honda Beat'
  },
  {
    id: 2,
    code: 'AHM-OIL-001',
    name: 'Oli MPX 2',
    category: 'Oli',
    unit: 'Botol',
    stock: 20,
    description: 'Oli mesin Honda'
  },
  {
    id: 3,
    code: 'AHM-BRK-001',
    name: 'Kampas Rem Depan',
    category: 'Rem',
    unit: 'Set',
    stock: 4,
    description: 'Kampas rem depan motor Honda'
  },
  {
    id: 4,
    code: 'AHM-SPK-001',
    name: 'Busi NGK',
    category: 'Pengapian',
    unit: 'Pcs',
    stock: 3,
    description: 'Busi motor'
  },
  {
    id: 5,
    code: 'AHM-AIR-001',
    name: 'Filter Udara',
    category: 'Mesin',
    unit: 'Pcs',
    stock: 15,
    description: 'Filter udara motor'
  }
];

export const initialTransactions = [
  {
    id: 1,
    spare_part_id: 1,
    spare_part_code: 'AHM-KVY-001',
    spare_part_name: 'V-Belt Honda Beat',
    unit: 'Pcs',
    type: 'in',
    quantity: 12,
    notes: 'Stok awal',
    recorded_by: 'Admin Abadi Motor',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    spare_part_id: 2,
    spare_part_code: 'AHM-OIL-001',
    spare_part_name: 'Oli MPX 2',
    unit: 'Botol',
    type: 'in',
    quantity: 20,
    notes: 'Stok awal',
    recorded_by: 'Admin Abadi Motor',
    created_at: new Date().toISOString()
  }
];
