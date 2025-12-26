export interface Rect {
    x: number; // percentage 0-100
    y: number; // percentage 0-100
    width: number; // percentage 0-100
    height: number; // percentage 0-100
}

export interface Redaction extends Rect {
    id: string;
    pageIndex: number;
}

export interface PageDimensions {
    width: number;
    height: number;
}

declare global {
    interface Window {
        gtag: (...args: any[]) => void;
    }
}
