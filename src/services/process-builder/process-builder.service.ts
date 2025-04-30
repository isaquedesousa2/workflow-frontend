import { HttpService } from '@/services/http.service'

export class ProcessBuilderService {
  private httpService: HttpService

  constructor() {
    this.httpService = new HttpService('http://localhost:3333/api/v1/process-builder')
  }

  async getNodesTypes(): Promise<any> {
    return this.httpService.get('/node-types')
  }

  async createWorkflow(data: TCreateProcessBuilder): Promise<any> {
    return this.httpService.post('/', data)
  }
}

export const processBuilderService = new ProcessBuilderService()

export type TCreateProcessBuilder = {
  name: string
  description: string
  nodes: {
    type: string
    position: {
      x: number
      y: number
    }
    label: string
    description: string
    settings: Record<string, any>
  }[]
}
