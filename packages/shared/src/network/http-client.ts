import type { HttpClientContract } from '@core/di/contracts';

export class HttpClient implements HttpClientContract {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async get<TResponse>(url: string): Promise<TResponse> {
    const response = await fetch(`${this.baseUrl}${url}`);
    return response.json() as Promise<TResponse>;
  }

  async post<TRequest, TResponse>(url: string, body: TRequest): Promise<TResponse> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return response.json() as Promise<TResponse>;
  }

  async put<TRequest, TResponse>(url: string, body: TRequest): Promise<TResponse> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return response.json() as Promise<TResponse>;
  }

  async delete(url: string): Promise<void> {
    await fetch(`${this.baseUrl}${url}`, {
      method: 'DELETE',
    });
  }
}
