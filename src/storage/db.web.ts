// ============================================================
// Web Storage Layer — localStorage-backed scan history
// Mirrors the native SQLite API used by the app.
// ============================================================
import { Intent } from '../engine/parser';

export interface ScanRecord {
  id: number;
  timestamp: string;
  rawText: string;
  intents: Intent[];
  imageUri: string | null;
  source: 'camera' | 'gallery';
  intentCount: number;
}

const STORAGE_KEY = 'fastscan.scans.v1';

function readAll(): ScanRecord[] {
  if (typeof localStorage === 'undefined') return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as ScanRecord[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function writeAll(records: ScanRecord[]): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function nextId(records: ScanRecord[]): number {
  if (records.length === 0) return 1;
  return Math.max(...records.map((r) => r.id)) + 1;
}

export async function insertScan(params: {
  rawText: string;
  intents: Intent[];
  imageUri: string | null;
  source: 'camera' | 'gallery';
}): Promise<number> {
  const records = readAll();
  const id = nextId(records);
  const record: ScanRecord = {
    id,
    timestamp: new Date().toISOString(),
    rawText: params.rawText,
    intents: params.intents,
    imageUri: params.imageUri,
    source: params.source,
    intentCount: params.intents.length,
  };
  records.push(record);
  writeAll(records);
  return id;
}

export async function getScans(limit = 20, offset = 0): Promise<ScanRecord[]> {
  const records = readAll().sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  return records.slice(offset, offset + limit);
}

export async function getScanById(id: number): Promise<ScanRecord | null> {
  const record = readAll().find((r) => r.id === id);
  return record ?? null;
}

export async function deleteScan(id: number): Promise<void> {
  const records = readAll().filter((r) => r.id !== id);
  writeAll(records);
}

export async function clearAllScans(): Promise<void> {
  writeAll([]);
}

export async function getScanCount(): Promise<number> {
  return readAll().length;
}
