import { set, get, del } from 'idb-keyval';
import type { Redaction } from '../types';

const STORE_KEY_FILE = 'cleansend_file';
const STORE_KEY_REDACTIONS = 'cleansend_redactions';

export async function saveAppState(file: File, redactions: Redaction[]) {
    console.log('[Storage] Saving app state...', { fileName: file.name, fileSize: file.size, redactionCount: redactions.length });
    try {
        const arrayBuffer = await file.arrayBuffer();
        await set(STORE_KEY_FILE, {
            data: arrayBuffer,
            name: file.name,
            type: file.type
        });
        await set(STORE_KEY_REDACTIONS, redactions);
        console.log('[Storage] App state saved successfully');
    } catch (err) {
        console.error('Failed to save app state:', err);
    }
}

export async function loadAppState(): Promise<{ file: File | undefined; redactions: Redaction[] | undefined }> {
    console.log('[Storage] Loading app state...');
    try {
        const savedData = await get<{ data: ArrayBuffer; name: string; type: string }>(STORE_KEY_FILE);
        const redactions = await get<Redaction[]>(STORE_KEY_REDACTIONS);

        if (savedData) {
            const file = new File([savedData.data], savedData.name, { type: savedData.type });
            console.log('[Storage] App state loaded & File reconstructed:', { fileName: file.name, redactionCount: redactions?.length });
            return { file, redactions };
        }

        return { file: undefined, redactions: undefined };
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
