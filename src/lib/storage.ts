import { set, get, del } from 'idb-keyval';
import type { Redaction } from '../types';
import type { FullExplanation } from './explain/types';

const STORE_KEY_FILE = 'medexplain_file';
const STORE_KEY_REDACTIONS = 'medexplain_redactions';
const STORE_KEY_EXPLANATION = 'medexplain_explanation';
const STORE_KEY_METADATA = 'medexplain_metadata';

interface SaveOptions {
    file?: File | null;
    redactions?: Redaction[];
    fullExplanation?: FullExplanation | null;
    metadata?: any;
}

export async function saveAppState(options: SaveOptions) {
    console.log('[Storage] Saving app state...', {
        hasFile: !!options.file,
        redactionCount: options.redactions?.length,
        hasExplanation: !!options.fullExplanation
    });

    try {
        if (options.file) {
            const arrayBuffer = await options.file.arrayBuffer();
            await set(STORE_KEY_FILE, {
                data: arrayBuffer,
                name: options.file.name,
                type: options.file.type
            });
        }

        if (options.redactions) {
            await set(STORE_KEY_REDACTIONS, options.redactions);
        }

        if (options.fullExplanation) {
            await set(STORE_KEY_EXPLANATION, options.fullExplanation);
        }

        if (options.metadata) {
            await set(STORE_KEY_METADATA, options.metadata);
        }

        console.log('[Storage] App state saved successfully');
    } catch (err) {
        console.error('Failed to save app state:', err);
    }
}

export async function loadAppState(): Promise<SaveOptions> {
    console.log('[Storage] Loading app state...');
    try {
        const savedData = await get<{ data: ArrayBuffer; name: string; type: string }>(STORE_KEY_FILE);
        const redactions = await get<Redaction[]>(STORE_KEY_REDACTIONS);
        const fullExplanation = await get<FullExplanation>(STORE_KEY_EXPLANATION);
        const metadata = await get<any>(STORE_KEY_METADATA);

        let file: File | undefined = undefined;
        if (savedData) {
            file = new File([savedData.data], savedData.name, { type: savedData.type });
            console.log('[Storage] App state loaded & File reconstructed:', { fileName: file.name });
        }

        return { file, redactions, fullExplanation, metadata };
    } catch (err) {
        console.error('Failed to load app state:', err);
        return {};
    }
}

export async function clearAppState() {
    console.log('[Storage] Clearing app state...');
    try {
        await del(STORE_KEY_FILE);
        await del(STORE_KEY_REDACTIONS);
        await del(STORE_KEY_EXPLANATION);
        await del(STORE_KEY_METADATA);
    } catch (err) {
        console.error('Failed to clear app state:', err);
    }
}
