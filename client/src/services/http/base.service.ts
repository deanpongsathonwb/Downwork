import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import { httpClient } from './axios.instance'
import type { ApiResponse } from '@/types'

// ============================================================
// BASE SERVICE CLASS
// All feature services extend this to get typed HTTP methods.
// ============================================================

export abstract class BaseService {
  protected readonly basePath: string

  constructor(basePath: string) {
    this.basePath = basePath
  }

  protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const res: AxiosResponse<ApiResponse<T>> = await httpClient.get(this.basePath + url, config)
    return res.data
  }

  protected async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const res: AxiosResponse<ApiResponse<T>> = await httpClient.post(this.basePath + url, data, config)
    return res.data
  }

  protected async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const res: AxiosResponse<ApiResponse<T>> = await httpClient.put(this.basePath + url, data, config)
    return res.data
  }

  protected async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const res: AxiosResponse<ApiResponse<T>> = await httpClient.patch(this.basePath + url, data, config)
    return res.data
  }

  protected async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const res: AxiosResponse<ApiResponse<T>> = await httpClient.delete(this.basePath + url, config)
    return res.data
  }

  protected async upload<T>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const res: AxiosResponse<ApiResponse<T>> = await httpClient.post(this.basePath + url, formData, {
      ...config,
      headers: { ...config?.headers, 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  }
}
