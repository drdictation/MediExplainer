import { set, get, del } from 'idb-keyval';
import type { Redaction } from '../types';

const STORE_KEY_FILE = 'cleansend_file';
const STORE_KEY_REDACTIONS = 'cleansend_redactions';

export async function saveAppState(file: File, redactions: Redaction[]) {
    console.log('[Storage] Saving app state...', { fileName: file.name, fileSize: file.size, redactionCount: redactions.length });
    try {
        await set(STORE_KEY_FILE, file);
        await set(STORE_KEY_REDACTIONS, redactions);
        console.log('[Storage] App state saved successfully');
    } catch (err) {
        console.error('Failed to save app state:', err);
    }
}

export async function loadAppState(): Promise<{ file: File | undefined; redactions: Redaction[] | undefined }> {
    console.log('[Storage] Loading app state...');
    try {
        const file = await get<File>(STORE_KEY_FILE);
        const redactions = await get<Redaction[]>(STORE_KEY_REDACTIONS);
        console.log('[Storage] App state loaded:', { fileFound: !!file, redactionsFound: !!redactions, redactionCount: redactions?.length });
        return { file, redactions };
    } catch (err) {
        console.error('Failed to load app state:', err);
        return { file: undefined, redactions: undefined };
    }
}

export async function clearAppState() {
    console.log('[Storage] Clearing app state...');
    try {
        await del(STORE_KEY_FILE);
        await del(STORE_KEY_REDACTIONS);
    } catch (err) {
        console.error('Failed to clear app state:', err);
    }
}
