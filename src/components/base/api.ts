import { ApiPostMethods, ErrorState } from "../../types/base/api";

/**
 * Базовый класс для работы с API
 */
export class Api {
    readonly baseUrl: string;
    protected _options: RequestInit;

    constructor(baseUrl: string, options: RequestInit = {}) {
        this.baseUrl = baseUrl;
        this._options = {
            headers: {
                "Content-Type": "application/json",
                ...(options.headers as object ?? {})
            }
        };
    }

    protected async _handleResponse<T>(response: Response): Promise<T> {
        if (response.ok)
            return response.json();

        const data = (await response.json()) as ErrorState;
        return Promise.reject(data.error ?? response.statusText);
    }

    protected async _get<T>(uri: string) {
        const method = "GET";
        const response = await fetch(this.baseUrl + uri, {
            ...this._options,
            method,
        });
        return this._handleResponse<T>(response);
    }

    protected async _post<T>(
        uri: string,
        data: object,
        method: ApiPostMethods = "POST"
    ) {
        const response = await fetch(this.baseUrl + uri, {
            ...this._options,
            method,
            body: JSON.stringify(data),
        });
        return this._handleResponse<T>(response);
    }
}
