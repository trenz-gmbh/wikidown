export class ApiError extends Error {
    response: Response;

    constructor(response: Response, message?: string) {
        super(message ?? response.statusText);
        this.response = response;
    }
}

export default class ApiClient {
    private static baseUrl: string | null = null;

    static setBaseUrl(url: string) {
        if (!url.endsWith('/')) {
            url += '/';
        }

        this.baseUrl = url;
    }

    static getBaseUrl(): string | null {
        return this.baseUrl;
    }

    private static buildHeaders(): HeadersInit {
        return {};
    }

    private static convertToFormData(data: Record<string, string | Blob>): FormData {
        const form = new FormData();
        const form_data: Record<string, string | Blob> = {};

        for (const key in data) {
            if (!Object.hasOwnProperty.call(data, key))
                continue;

            if (data[key] instanceof File)
                form.append('files.' + key, data[key]);
            else
                form_data[key] = data[key];
        }

        form.append('data', JSON.stringify(form_data));

        return form;
    }

    private static getFullUrl(url: string): string {
        let fqu: URL;
        if (this.baseUrl !== null)
            fqu = new URL(this.baseUrl + url);
        else
            fqu = new URL(url);

        return fqu.href;
    }

    static async get(url: string) {
        console.log(`[ApiClient] [GET] ${url}`)

        const r = await fetch(
            this.getFullUrl(url),
            {
                headers: this.buildHeaders()
            });

        if (r.status > 299)
            throw new ApiError(r, "Invalid response code: " + r.status);

        return r;
    }

    static async post(url: string, body: Record<string, string>) {
        console.log(`[ApiClient] [POST] ${url}`)

        const r = await fetch(
            this.getFullUrl(url),
            {
                method: 'POST',
                body: this.convertToFormData(body),
                headers: {
                    ...this.buildHeaders()
                }
            });

        if (r.status > 299)
            throw new ApiError(r, "Invalid response code: " + r.status);

        return r;
    }

    static async put(url: string, body: Record<string, string>) {
        console.log(`[ApiClient] [PUT] ${url}`)

        const r = await fetch(
            this.getFullUrl(url),
            {
                method: 'PUT',
                body: this.convertToFormData(body),
                headers: {
                    ...this.buildHeaders()
                }
            });

        if (r.status > 299)
            throw new ApiError(r, "Invalid response code: " + r.status);

        return r;
    }

    static async getJson(url: string) {
        const r = await this.get(url);

        try {
            return await r.json();
        } catch (e) {
            throw new ApiError(r, "Failed to parse result as JSON");
        }
    }

    static async postJson(url: string, body: Record<string, string>) {
        const r = await this.post(url, body);

        try {
            return await r.json();
        } catch (e) {
            throw new ApiError(r, "Failed to parse result as JSON");
        }
    }

    static async putJson(url: string, body: Record<string, string>) {
        const r = await this.put(url, body);

        try {
            return await r.json();
        } catch (e) {
            throw new ApiError(r, "Failed to parse result as JSON");
        }
    }
}
