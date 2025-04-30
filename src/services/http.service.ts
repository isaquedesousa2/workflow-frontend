type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export type THttpServiceOptions = {
  headers?: Record<string, string>
  queryParams?: Record<string, string>
}

export type THttpResponsePagination<T> = {
  result: T
  statusCode: number
  previousPage: number
  nextPage: number
  lastPage: number
  currentPage: number
  totalElements: number
  totalPerPage: number
}

export type THttpResponse<T> = {
  result: T
  statusCode: number
}

export type THttpService = {
  get<T>(endpoint: string, options?: THttpServiceOptions): Promise<T>
  post<T>(endpoint: string, body: any, options?: THttpServiceOptions): Promise<T>
  patch<T>(endpoint: string, body: any, options?: THttpServiceOptions): Promise<T>
  delete<T>(endpoint: string, options?: THttpServiceOptions): Promise<T>
}

export class HttpService implements THttpService {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private buildUrl(endpoint: string, queryParams?: Record<string, string>): string {
    const url = new URL(`${this.baseUrl}${endpoint}`)
    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        url.searchParams.append(key, value)
      })
    }
    return url.toString()
  }

  private async request<T>(
    method: HttpMethod,
    endpoint: string,
    body: any,
    options: THttpServiceOptions = {},
  ): Promise<T> {
    const { headers = {}, queryParams } = options

    const url = this.buildUrl(endpoint, queryParams)

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    })
      .then((response) => response)
      .catch((error) => error.data)

    if (!response) {
      return { result: null, statusCode: 500 } as T
    }

    if (response.status === 204) {
      return { result: null, statusCode: response.status } as T
    }

    // if (response.status === 401 && endpoint !== '/auth/login') {
    //   await destroySession()
    // }

    const data = await response.json()

    return {
      ...data,
      statusCode: response.status,
    }
  }

  async get<T>(endpoint: string, options?: THttpServiceOptions): Promise<T> {
    return this.request<T>('GET', endpoint, undefined, options)
  }

  async post<T>(endpoint: string, body: any, options?: THttpServiceOptions): Promise<T> {
    return this.request<T>('POST', endpoint, body, options)
  }

  async patch<T>(endpoint: string, body: any, options?: THttpServiceOptions): Promise<T> {
    return this.request<T>('PATCH', endpoint, body, options)
  }

  async delete<T>(endpoint: string, options?: THttpServiceOptions): Promise<T> {
    return this.request<T>('DELETE', endpoint, undefined, options)
  }
}
