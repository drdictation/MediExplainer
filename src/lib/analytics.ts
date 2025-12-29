// Analytics Helper for GA4 + Google Ads
// Handles debouncing, deduplication, and debug logging.

declare global {
    interface Window {
        gtag: (...args: any[]) => void;
        dataLayer: any[];
        __ANALYTICS_DEBUG__?: boolean;
    }
}

export type AnalyticsEvent =
    | 'view_landing_page'
    | 'click_upload_cta'
    | 'upload_started'
    | 'upload_completed'
    | 'preview_rendered'
    | 'paywall_shown'
    | 'purchase_initiated'
    | 'purchase_completed'
    | 'full_report_unlocked';

interface AnalyticsParams {
    page_name?: string;
    page_path?: string;
    source?: string;
    file_type?: string;
    file_size_kb?: number;
    session_id?: string;
    transaction_id?: string;
    value?: number;
    currency?: string;
    [key: string]: any;
}

const trackedEvents = new Set<string>();

/**
 * Tracks an event to GA4 and/or GTM DataLayer
 */
export function track(eventName: AnalyticsEvent, params: AnalyticsParams = {}) {
    // 1. Enrich params with defaults
    const fullParams = {
        page_path: window.location.pathname,
        ...params,
    };

    // 2. Debug Logging
    if (import.meta.env.DEV || window.__ANALYTICS_DEBUG__) {
        console.groupCollapsed(`[Analytics] ${eventName}`);
        console.log(fullParams);
        console.groupEnd();
    }

    // 3. Send to Google Tags
    if (typeof window.gtag === 'function') {
        window.gtag('event', eventName, {
            ...fullParams,
            // Mapping for Google Ads specific needs
            // upload_completed (Primary) -> AW-1775585311/UXJICN295tgbEP-d1ZJC
            send_to:
                eventName === 'upload_completed' ? 'AW-1775585311/UXJICN295tgbEP-d1ZJC' :
                    eventName === 'purchase_completed' ? 'AW-1775585311/rtPjCMC9rNcbEP-d1ZJC' : // Verify this label if account changed
                        undefined,
        });
    } else {
        // Fallback or GTM dataLayer push if gtag generic func not ready but dataLayer is
        if (window.dataLayer) {
            window.dataLayer.push({
                event: eventName,
                ...fullParams
            });
        }
    }
}

/**
 * Tracks an event exactly once per session/page-load (deduplicated by key)
 */
export function trackOnce(key: string, eventName: AnalyticsEvent, params: AnalyticsParams = {}) {
    if (trackedEvents.has(key)) {
        if (import.meta.env.DEV || window.__ANALYTICS_DEBUG__) {
            console.log(`[Analytics] Skipped duplicate: ${key}`);
        }
        return;
    }
    trackedEvents.add(key);
    track(eventName, params);
}

/**
 * Reset tracked keys (useful for SPA navigation if needed)
 */
export function resetTrackedEvents() {
    trackedEvents.clear();
}
