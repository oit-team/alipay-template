import { flowOptionSymbol } from '../types'

export function useFlowOption() {
  return inject(flowOptionSymbol)!.value
}
