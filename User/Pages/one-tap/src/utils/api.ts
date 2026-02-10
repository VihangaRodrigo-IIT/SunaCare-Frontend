import axios, { AxiosInstance, AxiosError } from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  async submitReport(report: any): Promise<ApiResponse<{ ticketId: string }>> {
    try {
      const response = await this.client.post('/reports', report)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getReport(ticketId: string): Promise<ApiResponse<any>> {
    try {
      const response = await this.client.get(`/reports/${ticketId}`)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async uploadPhoto(file: File): Promise<{ url: string }> {
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await this.client.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async reverseGeocode(lat: number, lng: number): Promise<string> {
    try {
      const response = await this.client.get('/geocode', {
        params: { latitude: lat, longitude: lng },
      })
      return response.data.address
    } catch (error) {
      throw this.handleError(error)
    }
  }

  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message
      return new Error(message)
    }
    return error instanceof Error ? error : new Error('An error occurred')
  }
}

export const apiClient = new ApiClient()
