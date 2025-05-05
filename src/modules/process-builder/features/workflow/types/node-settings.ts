export interface BaseNodeConfig {
  id: string
  type: string
  label: string
  description?: string
  position: { x: number; y: number }
}

interface BaseTriggerNodeConfig {
  label: string
  description?: string
}

export interface StartNodeConfig extends BaseNodeConfig {
  type: 'start'
  label: string
  description?: string
}

export interface EndNodeConfig extends BaseNodeConfig {
  type: 'end'
}

export interface ConditionNodeConfig extends BaseNodeConfig {
  type: 'condition'
}

export interface ManualTriggerNodeConfig extends BaseNodeConfig {
  type: 'manualTrigger'
  mechanism: 'USER' | 'GROUP' | 'SPECIFIC_GROUP' | 'NONE'
  specificGroupId?: {
    label: string
    value: string
  }
  specificUserId?: {
    label: string
    value: string
  }
}

export interface CronTriggerNodeConfig extends BaseNodeConfig {
  type: 'cronTrigger'
  data: {
    label: string
    description?: string
  }
  settings: {
    label: string
    description?: string
    intervalType: 'DAILY' | 'WEEKLY' | 'CUSTOM'
    days?: number[]
    hour?: number
    minute?: number
    schedule: string
  }
}

export interface ActionNodeConfig extends BaseNodeConfig {
  type: 'action'
  settings: {}
}

export interface ActivityNodeConfig extends BaseNodeConfig {
  type: 'activity'
  assigneeType: 'USER' | 'GROUP' | 'SPECIFIC_GROUP' | 'NONE'
  specificGroupId?: {
    label: string
    value: string
  }
  specificUserId?: {
    label: string
    value: string
  }
}

export interface DecisionNodeConfig extends BaseNodeConfig {
  type: 'decision'
  rulesYes: Array<{
    formField: {
      id: string
      label: string
    }
    operator: '>' | '<' | '>=' | '<=' | '==' | '!=' | 'contains' | 'startsWith' | 'endsWith'
    comparisonType: 'value' | 'field'
    comparisonValue?: string
    comparisonField?: {
      id: string
      label: string
    }
  }>
  rulesNo: Array<{
    formField: {
      id: string
      label: string
    }
    operator: '>' | '<' | '>=' | '<=' | '==' | '!=' | 'contains' | 'startsWith' | 'endsWith'
    comparisonType: 'value' | 'field'
    comparisonValue?: string
    comparisonField?: {
      id: string
      label: string
    }
  }>
}

export type NodeConfig =
  | StartNodeConfig
  | EndNodeConfig
  | ConditionNodeConfig
  | ManualTriggerNodeConfig
  | CronTriggerNodeConfig
  | ActionNodeConfig
  | ActivityNodeConfig
  | DecisionNodeConfig

export interface WorkflowConfig {
  id: string
  name: string
  description?: string
  nodes: NodeConfig[]
  edges: Array<{
    id: string
    source: string
    target: string
    sourceHandle?: string
    targetHandle?: string
  }>
  createdAt: string
  updatedAt: string
}

export interface NodeSettings<T> {
  id: string
  type: string
  data: T
}
