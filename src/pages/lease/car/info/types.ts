export interface VehicleParams {
  vehicleId: number
  carNumber: string
}

export const vehicleParamsSymbol = Symbol('vehicleParams') as InjectionKey<VehicleParams>
