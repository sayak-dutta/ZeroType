// ============================================================
// Database Layer — expo-sqlite Scan History
// ============================================================
import * as SQLite from 'expo-sqlite';
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

let _db: SQLite.SQLiteDatabase | null = null;

async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (_db) return _db;
  _db = await SQLite.openDatabaseAsync('scanintent.db');
  await _db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS scans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT NOT NULL,
      raw_text TEXT NOT NULL DEFAULT '',
      intents TEXT NOT NULL DEFAULT '[]',
      image_uri TEXT,
      source TEXT NOT NULL DEFAULT 'camera',
      intent_count INTEGER NOT NULL DEFAULT 0
    );
  `);
  return _db;
}

export async function insertScan(params: {
  rawText: string;
  intents: Intent[];
  imageUri: string | null;
  source: 'camera' | 'gallery';
}): Promise<number> {
  const db = await getDb();
  const ts = new Date().toISOString();
  const result = await db.runAsync(
    `INSERT INTO scans (timestamp, raw_text, intents, image_uri, source, intent_count)
     VALUES (?, ?, ?, ?, ?, ?)`,
    ts,
    params.rawText,
    JSON.stringify(params.intents),
    params.imageUri ?? null,
    params.source,
    params.intents.length
  );
  return result.lastInsertRowId;
}

export async function getScans(limit = 20, offset = 0): Promise<ScanRecord[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<any>(
    `SELECT * FROM scans ORDER BY timestamp DESC LIMIT ? OFFSET ?`,
    limit,
    offset
  );
  return rows.map(rowToRecord);
}

export async function getScanById(id: number): Promise<ScanRecord | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<any>(`SELECT * FROM scans WHERE id = ?`, id);
  return row ? rowToRecord(row) : null;
}

export async function deleteScan(id: number): Promise<void> {
  const db = await getDb();
  await db.runAsync(`DELETE FROM scans WHERE id = ?`, id);
}

export async function clearAllScans(): Promise<void> {
  const db = await getDb();
  await db.runAsync(`DELETE FROM scans`);
}

export async function getScanCount(): Promise<number> {
  const db = await getDb();
  const row = await db.getFirstAsync<{ count: number }>(`SELECT COUNT(*) as count FROM scans`);
  return row?.count ?? 0;
}

function rowToRecord(row: any): ScanRecord {
  let intents: Intent[] = [];
  try { intents = JSON.parse(row.intents ?? '[]'); } catch { /* */ }
  return {
    id: row.id,
    timestamp: row.timestamp,
    rawText: row.raw_text ?? '',
    intents,
    imageUri: row.image_uri ?? null,
    source: (row.source as 'camera' | 'gallery') ?? 'camera',
    intentCount: row.intent_count ?? intents.length,
  };
}
