import { AsyncThunk, AsyncThunkPayloadCreator, createAsyncThunk } from '@reduxjs/toolkit'

type IFn = (...args: never[]) => unknown

type IConfig<TServiceFn extends IFn> = {
    /**
     * skip creating thunk
     */
    skip?: boolean
    /**
     * post handler of service function, the previous payload, returned and thunkAPI will be given
     */
    postHandler?: AsyncThunkPayloadCreator<
        void,
        {
            payload: Parameters<TServiceFn>[0]
            returned: Awaited<ReturnType<TServiceFn>>
        },
        {}
    >
}

type IConfigMap<TService> = {
    [TKey in keyof TService]: TService[TKey] extends IFn ? IConfig<TService[TKey]> : never
}

type IThunkMap<TService> = {
    [TKey in keyof TService]: TService[TKey] extends IFn
        ? AsyncThunk<Awaited<ReturnType<TService[TKey]>>, Parameters<TService[TKey]>[0], {}>
        : never
}

interface IServiceClass {
    getInstance: () => unknown
}

/**
 * quickly create thunk for every public instance methods of `TServiceClass`,
 * just ignore types and read as pure js, the logic should be straightforward
 *
 * @example
 *
 * export const {
 *     getUserProfile,
 *     saveUserProfile,
 * } = createThunkMap(ProfileConstants.MODULE_PREFIX, UserProfileService, {
 *     // skip creating thunk for this service function, type of config is extensible for future usage
 *     formatUserProfile: { skip: true },
 *     // hook after service function call
 *     getComplexObject: {
 *         postHandler: ({ returned }, { dispatch }) => {
 *             dispatch(setPart1(returned.part1))
 *             dispatch(setPart2(returned.part2))
 *         },
 *     },
 * })
 */
export function createThunkMap<
    TServiceClass extends IServiceClass,
    TService extends ReturnType<TServiceClass['getInstance']>
>(
    modulePrefix: string,
    service: TServiceClass,
    optionalConfigMap?: Partial<IConfigMap<TService>>
): IThunkMap<TService> {
    const instance = service.getInstance()
    // public instance methods are defined on the prototype
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Method_definitions#method_definitions_in_classes
    const keys = Object.getOwnPropertyNames(Object.getPrototypeOf(instance))
    const configMap = optionalConfigMap || {}

    const entries = keys.reduce<[string, AsyncThunk<unknown, unknown, {}>][]>((arr, key) => {
        const config = (Reflect.get(configMap, key) || {}) as IConfig<IFn>
        if (key === 'constructor' || config.skip) {
            return arr
        }

        arr.push([
            key,
            createAsyncThunk(
                `${modulePrefix}/${key}`,
                async (payload: unknown, thunkAPI): Promise<unknown> => {
                    try {
                        const fn = Reflect.get(instance as {}, key) as IFn
                        const returned = await fn.call(instance, payload as never)
                        config.postHandler?.({ payload: payload as never, returned }, thunkAPI)
                        return returned
                    } catch (error) {
                        // may extend to add your dedicated error handler here before fail into store middleware
                        return Promise.reject(error)
                    }
                }
            ),
        ])
        return arr
    }, [])

    return Object.fromEntries(entries) as IThunkMap<TService>
}
