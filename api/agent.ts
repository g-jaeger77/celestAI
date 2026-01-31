
export interface DashboardResponse {
    next_window_focus: string;
    next_window_desc: string;
    astral_alert_title: string;
    astral_alert_desc: string;
    transit_title: string;
    transit_desc: string;
    daily_quote: string;
    score_mental: number;
    score_physical: number;
    score_emotional: number;
    planetary_hour?: string;
    is_void?: boolean;
}

export interface Metric {
    label: string;
    value: string;
    desc: string;
}

export interface DetailContext {
    main_status: string;
    ring_status: string;
    metrics: Metric[];
}

export interface DetailResponse {
    score: number;
    title: string;
    trend_data: Array<{ day: string; value: number }>;
    analysis: string;
    recommendation: string;
    context: DetailContext;
}

const API_BASE = "http://localhost:8000";

export const agentApi = {
    getDashboard: async (userId: string, lat?: number, lon?: number, timezone?: string): Promise<DashboardResponse> => {
        const params = new URLSearchParams({ user_id: userId });
        if (lat) params.append('lat', lat.toString());
        if (lon) params.append('lon', lon.toString());
        if (timezone) params.append('timezone', timezone);

        const response = await fetch(`${API_BASE}/agent/dashboard?${params.toString()}`);
        if (!response.ok) throw new Error("Falha ao carregar dashboard");
        return response.json();
    },

    getDetail: async (dimension: 'mental' | 'physical' | 'emotional', userId: string): Promise<DetailResponse> => {
        const response = await fetch(`${API_BASE}/agent/detail/${dimension}?user_id=${userId}`);
        if (!response.ok) throw new Error(`Falha ao carregar detalhe ${dimension}`);
        return response.json();
    }
};
