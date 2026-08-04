export type SqliteConnectionState = 'idle' | 'ready'

export const sqliteState: { status: SqliteConnectionState } = {
  status: 'idle',
}

export async function initializeSqlite(): Promise<void> {
  sqliteState.status = 'ready'
}