import type {
  ConnectErrorType,
  Connector,
  CreateConnectorFn,
} from '@wagmi/core'
import { config } from '@wagmi/test'
import type { Address } from 'viem'
import { expectTypeOf, test } from 'vitest'

import { useConnect } from './useConnect.js'

const connector = config.connectors[0]!
const contextValue = { foo: 'bar' } as const

test('context', () => {
  const { connect, context, data, error, variables } = useConnect({
    mutation: {
      onMutate(variables) {
        expectTypeOf(variables).toEqualTypeOf<{
          chainId?: number | undefined
          connector: Connector | CreateConnectorFn
        }>()
        return contextValue
      },
      onError(error, variables, context) {
        expectTypeOf(variables).toEqualTypeOf<{
          chainId?: number | undefined
          connector: Connector | CreateConnectorFn
        }>()
        expectTypeOf(error).toEqualTypeOf<ConnectErrorType>()
        expectTypeOf(context).toEqualTypeOf<typeof contextValue | undefined>()
      },
      onSuccess(data, variables, context) {
        expectTypeOf(variables).toEqualTypeOf<{
          chainId?: number | undefined
          connector: Connector | CreateConnectorFn
        }>()
        expectTypeOf(data).toEqualTypeOf<{
          accounts: readonly [Address, ...Address[]]
          chainId: number
        }>()
        expectTypeOf(context).toEqualTypeOf<typeof contextValue>()
      },
      onSettled(data, error, variables, context) {
        expectTypeOf(data).toEqualTypeOf<
          | {
              accounts: readonly [Address, ...Address[]]
              chainId: number
            }
          | undefined
        >()
        expectTypeOf(error).toEqualTypeOf<ConnectErrorType | null>()
        expectTypeOf(variables).toEqualTypeOf<{
          chainId?: number | undefined
          connector: Connector | CreateConnectorFn
        }>()
        expectTypeOf(context).toEqualTypeOf<typeof contextValue | undefined>()
      },
    },
  })

  expectTypeOf(data.value).toEqualTypeOf<
    | {
        accounts: readonly [Address, ...Address[]]
        chainId: number
      }
    | undefined
  >()
  expectTypeOf(error.value).toEqualTypeOf<ConnectErrorType | null>()
  expectTypeOf(variables.value).toMatchTypeOf<
    | {
        chainId?: number | undefined
        connector: Connector | CreateConnectorFn
      }
    | undefined
  >()
  expectTypeOf(context.value).toEqualTypeOf<typeof contextValue | undefined>()

  connect(
    { connector },
    {
      onError(error, variables, context) {
        expectTypeOf(variables).toEqualTypeOf<{
          chainId?: number | undefined
          connector: typeof connector | CreateConnectorFn
          foo?: string | undefined
        }>()
        expectTypeOf(error).toEqualTypeOf<ConnectErrorType>()
        expectTypeOf(context).toEqualTypeOf<typeof contextValue | undefined>()
      },
      onSuccess(data, variables, context) {
        expectTypeOf(variables).toEqualTypeOf<{
          chainId?: number | undefined
          connector: typeof connector | CreateConnectorFn
          foo?: string | undefined
        }>()
        expectTypeOf(data).toEqualTypeOf<{
          accounts: readonly [Address, ...Address[]]
          chainId: number
        }>()
        expectTypeOf(context).toEqualTypeOf<typeof contextValue>()
      },
      onSettled(data, error, variables, context) {
        expectTypeOf(data).toEqualTypeOf<
          | {
              accounts: readonly [Address, ...Address[]]
              chainId: number
            }
          | undefined
        >()
        expectTypeOf(error).toEqualTypeOf<ConnectErrorType | null>()
        expectTypeOf(variables).toEqualTypeOf<{
          chainId?: number | undefined
          connector: typeof connector | CreateConnectorFn
          foo?: string | undefined
        }>()
        expectTypeOf(context).toEqualTypeOf<typeof contextValue | undefined>()
      },
    },
  )
})
