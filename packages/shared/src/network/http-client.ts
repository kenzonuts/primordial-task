import type {
  HttpClientContract,
  HttpRequestContract,
  HttpResponseContract,
} from '@core/di/contracts';

export class HttpClient implements HttpClientContract {
  constructor(private readonly baseUrl: string) {}

  async request<TResponse, TBody = unknown>(
    request: HttpRequestContract<TBody>,
  ): Promise<HttpResponseContract<TResponse>> {
    const response = await fetch(`${this.baseUrl}${request.path}`, {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
        ...request.headers,
      },
      body: request.body ? JSON.stringify(request.body) : undefined,
    });

    return {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      data: (await response.json()) as TResponse,
    };
  }
}
