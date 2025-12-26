import { set, get, del } from 'idb-keyval';
import type { Redaction } from '../types';

const STORE_KEY_FILE = 'cleansend_file';
const STORE_KEY_REDACTIONS = 'cleansend_redactions';

export async function saveAppState(file: File, redactions: Redaction[]) {
    try {
        await set(STORE_KEY_FILE, file);
        await set(STORE_KEY_REDACTIONS, redactions);
    } catch (err) {
        console.error('Failed to save app state:', err);
    }
}

export async function loadAppState(): Promise<{ file: File | undefined; redactions: Redaction[] | undefined }> {
    try {
        const file = await get<File>(STORE_KEY_FILE);
        const redactions = await get<Redaction[]>(STORE_KEY_REDACTIONS);
        return { file, redactions };
    } catch (err) {
        console.error('Failed to load app state:', err);
        return { file: undefined, redactions: undefined };
    }
}

export async function clearAppState() {
    try {
        await del(STORE_KEY_FILE);
        await del(STORE_KEY_REDACTIONS);
    } catch (err) {
        console.error('Failed to clear app state:', err);
    }
}
