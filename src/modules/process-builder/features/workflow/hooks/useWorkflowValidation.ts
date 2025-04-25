import { useCallback } from 'react'
import { Node, Edge } from 'reactflow'
import { useWorkflowBuilder } from '../contexts/WorkflowBuilderContext'

interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export const useWorkflowValidation = () => {
  const { nodes, edges } = useWorkflowBuilder()

  const validateWorkflow = useCallback((): ValidationResult => {
    const errors: string[] = []

    // Verifica se existe pelo menos um nó de início
    const hasStartNode = nodes.some((node) => node.type === 'startNode')
    if (!hasStartNode) {
      errors.push('O workflow deve ter pelo menos um nó de início')
    }

    // Verifica se existe pelo menos um nó de fim
    const hasEndNode = nodes.some((node) => node.type === 'endNode')
    if (!hasEndNode) {
      errors.push('O workflow deve ter pelo menos um nó de fim')
    }

    // Verifica se todos os nós estão conectados corretamente
    nodes.forEach((node) => {
      const nodeEdges = edges.filter((edge) => edge.source === node.id || edge.target === node.id)

      // Valida nós de início
      if (node.type === 'startNode') {
        const hasSourceConnection = edges.some((edge) => edge.source === node.id)
        if (!hasSourceConnection) {
          errors.push(`O nó de início "${node.data.label}" não tem conexão de saída`)
        }
      }

      // Valida nós de fim
      if (node.type === 'endNode') {
        const hasTargetConnection = edges.some((edge) => edge.target === node.id)
        if (!hasTargetConnection) {
          errors.push(`O nó de fim "${node.data.label}" não tem conexão de entrada`)
        }
      }

      // Valida nós de condição
      if (node.type === 'conditionNode') {
        const sourceConnections = edges.filter((edge) => edge.source === node.id)
        const targetConnections = edges.filter((edge) => edge.target === node.id)

        if (targetConnections.length === 0) {
          errors.push(`O nó de condição "${node.data.label}" não tem conexão de entrada`)
        }

        if (sourceConnections.length !== node.data.conditions?.length) {
          errors.push(
            `O nó de condição "${node.data.label}" deve ter uma conexão de saída para cada condição`,
          )
        }
      }

      // Valida nós de decisão
      if (node.type === 'decisionNode') {
        const sourceConnections = edges.filter((edge) => edge.source === node.id)
        if (sourceConnections.length !== 2) {
          errors.push(
            `O nó de decisão "${node.data.label}" deve ter exatamente duas conexões de saída (Sim/Não)`,
          )
        }
      }

      // Valida nós de atividade
      if (node.type === 'activityNode') {
        const hasTargetConnection = edges.some((edge) => edge.target === node.id)
        const hasSourceConnection = edges.some((edge) => edge.source === node.id)

        if (!hasTargetConnection) {
          errors.push(`O nó de atividade "${node.data.label}" não tem conexão de entrada`)
        }
        if (!hasSourceConnection) {
          errors.push(`O nó de atividade "${node.data.label}" não tem conexão de saída`)
        }
      }
    })

    // Verifica se existem nós isolados
    const connectedNodeIds = new Set(edges.flatMap((edge) => [edge.source, edge.target]))
    nodes.forEach((node) => {
      if (!connectedNodeIds.has(node.id) && node.type !== 'startNode' && node.type !== 'endNode') {
        errors.push(`O nó "${node.data.label}" está isolado e não está conectado ao fluxo`)
      }
    })

    return {
      isValid: errors.length === 0,
      errors,
    }
  }, [nodes, edges])

  return {
    validateWorkflow,
  }
}
