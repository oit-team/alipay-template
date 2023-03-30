export interface DriverParams {
  driverId: number
}

export const driverParamsSymbol = Symbol('driverParams') as InjectionKey<DriverParams>
