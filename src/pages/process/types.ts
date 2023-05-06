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

type AcceptStatus = 0 | 1
export interface WorkOrderSubmit {
  (params: any, options: {
    // 下一个任务编号
    nextTaskCode?: string
    // 0：不同意 1：同意
    approvalStatus: AcceptStatus
    // 备注
    approvalNotes?: string
  } | AcceptStatus): Promise<any>
}

export const workOrderSubmitSymbol = Symbol('workOrderSubmit') as InjectionKey<WorkOrderSubmit>

export interface FlowOption {
  workCode: string
  flowCode: string
  taskCode: string
  // 当前初始步骤
  step: number
  // 选中的步骤
  stepActive?: number
  // 选中的步骤code
  stepCodeActive?: string
  // 当前操作日志
  currentLogs?: string[]
  // 当前步骤详细数据
  currentStep?: any
  // 当前步骤是否是回显
  isReview: boolean
  // 主要参数
  mainParams: Record<string, any>
  // 设置选中的步骤
  setViewStep: (item: FlowOption['workFlowSteps'][number]) => void
  // 提交
  submit: WorkOrderSubmit
  // 申请
  apply: WorkOrderApply
  // 拒绝
  reject: (data?: Record<string, any>) => Promise<any>
  // 步骤列表
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
