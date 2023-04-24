export interface WorkOrderApply {
  (params: Record<string, any>): Promise<any>
}

export const workOrderApplySymbol = Symbol('workOrderApply') as InjectionKey<WorkOrderApply>

/**
 * @deprecated 改用 FlowOption
 */
export interface WorkOrderInfo {
  setViewStep: (item: WorkOrderInfo['workFlowSteps'][number]) => void
  currentLogs?: string[]
  currentStep?: any
  workCode: string
  flowCode: string
  taskCode: string
  step: number
  viewStep: number
  viewStepCode: string
  isReview: boolean
  mainParams: Record<string, any>
  workFlowSteps: {
    id: number
    name: string
    taskCode: string
    flowCode: string
    preId: number
    nextId: number
    step: number
    role: number
    pageUrl: string
    postUrl: string
    clickEnable: number
  }[]
}

/**
 * @deprecated 改用 flowOptionSymbol
 */
export const workOrderInfoSymbol = Symbol('workOrderInfo') as InjectionKey<Ref<WorkOrderInfo>>

export interface WorkOrderSubmit {
  (params: any, options: {
    // 下一个任务编号
    nextTaskCode?: string
    // 0：不同意 1：同意
    approvalStatus: 0 | 1
    // 备注
    approvalNotes?: string
  }): Promise<any>
}

export const workOrderSubmitSymbol = Symbol('workOrderSubmit') as InjectionKey<WorkOrderSubmit>

export interface FlowOption {
  workCode: string
  flowCode: string
  taskCode: string
  step: number
  stepActive?: number
  stepCodeActive?: string
  currentLogs?: string[]
  currentStep?: any
  isReview: boolean
  mainParams: Record<string, any>
  setViewStep: (item: FlowOption['workFlowSteps'][number]) => void
  submit: WorkOrderSubmit
  apply: WorkOrderApply
  workFlowSteps: {
    id: number
    name: string
    taskCode: string
    flowCode: string
    preId: number
    nextId: number
    step: number
    role: number
    pageUrl: string
    postUrl: string
    clickEnable: number
  }[]
}

export const flowOptionSymbol = Symbol('flowOptionSymbol') as InjectionKey<Ref<FlowOption>>
