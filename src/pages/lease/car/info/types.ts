export interface VehicleParams {
  vehicleId: number
}

export const vehicleParamsSymbol = Symbol('vehicleParams') as InjectionKey<VehicleParams>
