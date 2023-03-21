export interface WorkOrderApplyParams {
  workCode: string
  flowCode: string
  taskCode: string
  nextTaskCode: string
  // 0：不同意 1：同意
  approvalStatus: 0 | 1
  approvalNotes: string
  params: any
}

export const workOrderApplySymbol = Symbol('workOrderApply') as InjectionKey<(params: WorkOrderApplyParams) => Promise<any>>

export interface WorkOrderInfo {
  workCode: string
  flowCode: string
  taskCode: string
}

export const workOrderInfoSymbol = Symbol('workOrderInfo') as InjectionKey<Ref<WorkOrderInfo>>
