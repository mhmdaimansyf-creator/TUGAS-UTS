
import {
  dummyUsers,
  initialSpareParts,
  initialTransactions
} from '../dummyData.js';

const STORAGE_KEYS = {
  users: 'abadi_motor_users',
  spareParts: 'abadi_motor_spare_parts',
  transactions: 'abadi_motor_transactions'
};

// Membaca data dari localStorage
function readData(key, fallback) {
  try {
    const savedData = localStorage.getItem(key);

    if (savedData === null) {
      return fallback;
    }

    return JSON.parse(savedData);
  } catch (error) {
    console.error('Gagal membaca data:', error);
    return fallback;
  }
}

// Menyimpan data ke localStorage
function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Menyiapkan data awal aplikasi
export function initializeStorage() {
  if (localStorage.getItem(STORAGE_KEYS.users) === null) {
    saveData(STORAGE_KEYS.users, dummyUsers);
  }

  if (localStorage.getItem(STORAGE_KEYS.spareParts) === null) {
    saveData(STORAGE_KEYS.spareParts, initialSpareParts);
  }

  if (localStorage.getItem(STORAGE_KEYS.transactions) === null) {
    saveData(STORAGE_KEYS.transactions, initialTransactions);
  }
}

// Data pengguna
export function getUsers() {
  return readData(STORAGE_KEYS.users, dummyUsers);
}

// Data spare part
export function getSpareParts() {
  return readData(STORAGE_KEYS.spareParts, initialSpareParts);
}

export function saveSpareParts(data) {
  saveData(STORAGE_KEYS.spareParts, data);
}

// Data transaksi
export function getTransactions() {
  return readData(STORAGE_KEYS.transactions, initialTransactions);
}

export function saveTransactions(data) {
  saveData(STORAGE_KEYS.transactions, data);
}
