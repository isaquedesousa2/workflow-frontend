'use server'

import { processBuilderService } from '@/services/process-builder/process-builder.service'

export async function criarProcessoAction(payload: any) {
  try {
    const response = await processBuilderService.createWorkflow(payload)
    return { success: true, data: response }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}
