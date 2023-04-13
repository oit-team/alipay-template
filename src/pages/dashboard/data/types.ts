export interface DataBoardInfo {
  /**
   * 看板数据
   */
  bulletinBoard: BulletinBoard
  /**
   * 司机分类情况
   */
  driverClassificaInfor: DriverClassificaInfor[]
  /**
   * 司机分类日增长情况
   */
  driverClassificationGrowth: DriverClassificationGrowth
  /**
   * 司机情况趋势
   */
  driverSituationTrends: DriverSituationTrend[]
  /**
   * 时长情况趋势
   */
  durationTrend: DurationTrend[]
  /**
   * 订单&流水趋势
   */
  flowAndOrderTrends: FlowAndOrderTrend[]
  /**
   * 人均订单情况
   */
  perCapitaOrderTrend: PerCapitaOrderTrend[]
}

/**
* 看板数据
*/
export interface BulletinBoard {
  /**
   * 活跃司机
   */
  activeDriver: ActiveDriver
  /**
   * 活跃率
   */
  activityRate: ActivityRate
  /**
   * 订单均价
   */
  averageOrderPrice: AverageOrderPrice
  /**
   * 司机完单
   */
  completedQuantity: CompletedQuantity
  /**
   * 合规率
   */
  complianceRate: ComplianceRate
  /**
   * 合规司机
   */
  compliantDrivers: CompliantDrivers
  /**
   * 司机流水
   */
  driverFlow: DriverFlow
  /**
   * 司机总数
   */
  driveTotal: DriveTotal
  /**
   * 时长有效率
   */
  durationEfficiency: DurationEfficiency
  /**
   * 当日新增
   */
  newOnTheSameDay: NewOnTheSameDay
  /**
   * 出车司机
   */
  onlineDriver: OnlineDriver
  /**
   * 出车率
   */
  onlineRate: OnlineRate
  /**
   * 人均完单
   */
  perCapitaCompletionOfOrders: PerCapitaCompletionOfOrders
  /**
   * 人均流水
   */
  perCapitaFlow: PerCapitaFlow
  /**
   * 人均高峰时长
   */
  perCapitaPeakHours: BulletinBoardPerCapitaPeakHours
  /**
   * 人均服务时长
   */
  perCapitaServiceHours: BulletinBoardPerCapitaServiceHours
  /**
   * 人均出车时长
   */
  perCapitaTravelTime: PerCapitaTravelTime
}

/**
* 活跃司机
*/
export interface ActiveDriver {
  monthToMonth: number
  value: number
  yearToYear: number
}

/**
* 活跃率
*/
export interface ActivityRate {
  monthToMonth: number
  value: number
  yearToYear: number
}

/**
* 订单均价
*/
export interface AverageOrderPrice {
  monthToMonth: number
  value: number
  yearToYear: number
}

/**
* 司机完单
*/
export interface CompletedQuantity {
  monthToMonth: number
  value: number
  yearToYear: number
}

/**
* 合规率
*/
export interface ComplianceRate {
  monthToMonth: number
  value: number
  yearToYear: number
}

/**
* 合规司机
*/
export interface CompliantDrivers {
  monthToMonth: number
  value: number
  yearToYear: number
}

/**
* 司机总数
*/
export interface DriveTotal {
  monthToMonth: number
  value: number
  yearToYear: number
}

/**
* 司机流水
*/
export interface DriverFlow {
  monthToMonth: number
  value: number
  yearToYear: number
}

/**
* 时长有效率
*/
export interface DurationEfficiency {
  monthToMonth: number
  value: number
  yearToYear: number
}

/**
* 当日新增
*/
export interface NewOnTheSameDay {
  monthToMonth: number
  value: number
  yearToYear: number
}

/**
* 出车司机
*/
export interface OnlineDriver {
  monthToMonth: number
  value: number
  yearToYear: number
}

/**
* 出车率
*/
export interface OnlineRate {
  monthToMonth: number
  value: number
  yearToYear: number
}

/**
* 人均完单
*/
export interface PerCapitaCompletionOfOrders {
  monthToMonth: number
  value: number
  yearToYear: number
}

/**
* 人均流水
*/
export interface PerCapitaFlow {
  monthToMonth: number
  value: number
  yearToYear: number
}

/**
* 人均高峰时长
*/
export interface BulletinBoardPerCapitaPeakHours {
  monthToMonth: number
  value: number
  yearToYear: number
}

/**
* 人均服务时长
*/
export interface BulletinBoardPerCapitaServiceHours {
  monthToMonth: number
  value: number
  yearToYear: number
}

/**
* 人均出车时长
*/
export interface PerCapitaTravelTime {
  monthToMonth: number
  value: number
  yearToYear: number
}

export interface DriverClassificaInfor {
  /**
   * 司机分类
   */
  driverClassifica: DriverClassifica
  /**
   * 司机数量
   */
  driversNumber: number
}

/**
* 司机分类
*/
export enum DriverClassifica {
  A类司机 = 'A类司机',
  B类司机 = 'B类司机',
  C类司机 = 'C类司机',
  D类司机 = 'D类司机',
  E类司机 = 'E类司机',
  F类司机 = 'F类司机',
}

/**
* 司机分类日增长情况
*/
export interface DriverClassificationGrowth {
  /**
   * 司机分类
   */
  driverClassifica: DriverClassifica
  /**
   * 司机数量
   */
  driversNumber: number
}

export interface DriverSituationTrend {
  activeDriver: number
  date: string
  newOnTheSameDay: number
  totalNumberOfDrivers: number
  trainDriver: number
}

export interface DurationTrend {
  /**
   * 有效时长率
   */
  effectiveDurationRate: EffectiveDurationRate
  /**
   * 人均在线时长
   */
  perCapitaOnlineSh: PerCapitaOnlineSh
  /**
   * 人均服务时长
   */
  perCapitaPeakHours: DurationTrendPerCapitaPeakHours
  /**
   * 人均服务时长
   */
  perCapitaServiceHours: DurationTrendPerCapitaServiceHours
}

/**
* 有效时长率
*/
export interface EffectiveDurationRate {
  date: string
  value: number
}

/**
* 人均在线时长
*/
export interface PerCapitaOnlineSh {
  date: string
  value: number
}

/**
* 人均服务时长
*/
export interface DurationTrendPerCapitaPeakHours {
  date: string
  value: number
}

/**
* 人均服务时长
*/
export interface DurationTrendPerCapitaServiceHours {
  date: string
  value: number
}

export interface FlowAndOrderTrend {
  /**
   * 流水金额
   */
  amounts: number
  /**
   * 日期时间
   */
  date: string
  /**
   * 订单数量
   */
  orderNum: number
}

export interface PerCapitaOrderTrend {
  averageOrderPrice: number
  date: string
  perCapitaFlow: number
  perCapitaOrders: number
}
