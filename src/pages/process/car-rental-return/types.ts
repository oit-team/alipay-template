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

export interface WorkOrderApply {
  (params: WorkOrderApplyParams): Promise<any>
}

export const workOrderApplySymbol = Symbol('workOrderApply') as InjectionKey<WorkOrderApply>

export interface WorkOrderInfo {
  workCode: string
  flowCode: string
  taskCode: string
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
