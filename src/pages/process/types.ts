export interface WorkOrderApply {
  (params: Record<string, any>): Promise<any>
}

export const workOrderApplySymbol = Symbol('workOrderApply') as InjectionKey<WorkOrderApply>

export interface WorkOrderInfo {
  setViewStep: (step: number) => void
  currentLogs?: string[]
  currentStep?: any
  workCode: string
  flowCode: string
  taskCode: string
  step: number
  viewStep: number
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
    parameter: null
    updateTime: null
    createDate: null
  }[]
}

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

export const workOrderSubmitSymbol = Symbol('workOrderInfo') as InjectionKey<WorkOrderSubmit>
