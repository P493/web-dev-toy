import { createSelector } from '@reduxjs/toolkit'

type StringIndexedObject = { [key: string]: unknown }
type EntryOfSelectorMap<TInputState> = [string, (inputState: TInputState) => unknown]
type SelectorMap<TInputState, TOutputState> = {
    [TKey in keyof TOutputState]: (inputState: TInputState) => TOutputState[TKey]
}

/**
 * quickly create selector for every prop of `TState`,
 * type annotations are low readability high efficiency here,
 * just ignore types and read as pure js, the logic should be straightforward
 *
 * hint: the result could be passed to api `createStructuredSelector`
 *
 * @example
 *
 * export const preferenceSelectorMap = createSelectorMap(
 *   selectPreference,
 *   initialProfileState.preference,
 *   {
 *     // select prop with your custom calculation
 *     language: (preference: IPreference) => formatLanguageCode(preference.language),
 *     // any new selector receive `TState` as input
 *     dateTimeFormat: (preference: IPreference) => preference.dateFormat + preference.dateTimeSeparator + preference.timeFormat,
 *   }
 * )
 *
 * // later usage
 * const dateFormat = useSelector(preferenceSelectorMap.dateFormat)
 * const language = useSelector(preferenceSelectorMap.language)
 * const dateTimeFormat = useSelector(preferenceSelectorMap.dateTimeFormat)
 */
export function createSelectorMap<TInputState, TState extends {}, TCustomState extends {}>(
    inputSelector: (inputState: TInputState) => TState,
    initialState: TState,
    customMap?: SelectorMap<TState, TCustomState>
): SelectorMap<TInputState, TState & TCustomState> {
    const keysOfCustomMap = customMap ? Object.keys(customMap) : undefined
    let keysToAutoSelect = Object.keys(initialState)
    if (keysOfCustomMap) {
        keysToAutoSelect = keysToAutoSelect.filter((key) => !keysOfCustomMap.includes(key))
    }

    const entries = keysToAutoSelect.map<EntryOfSelectorMap<TInputState>>((key) => [
        key,
        createSelector(inputSelector, (state: TState) => (state as StringIndexedObject)[key]),
    ])

    if (customMap) {
        const customEntries = Object.entries(customMap).map<EntryOfSelectorMap<TInputState>>(
            ([key, value]) => [key, createSelector(inputSelector, value as (state: TState) => unknown)]
        )
        entries.push(...customEntries)
    }

    return Object.fromEntries(entries) as SelectorMap<TInputState, TState & TCustomState>
}
