import { AnyAction } from 'redux'
import thunk, { ThunkDispatch } from 'redux-thunk'
import configureMockStore from 'redux-mock-store'
import { createThunkMap } from './createThunkMap'

const middlewares = [thunk]

function createMockStore<T = {}>() {
    return configureMockStore<T, ThunkDispatch<T, void, AnyAction>>(middlewares)()
}

describe('createThunkMap', () => {
    const store = createMockStore()

    const prefix = 'prefix'

    type IBill = {
        price: number
        qty: number
    }

    class TestService {
        static INSTANCE: TestService

        public static getInstance(): TestService {
            if (!this.INSTANCE) {
                this.INSTANCE = new TestService()
            }

            return this.INSTANCE
        }

        public async getBill(): Promise<IBill> {
            return Promise.resolve({
                price: 2,
                qty: 3,
            })
        }

        public async deleteA(payload: string) {
            return Promise.reject(`error on deleting ${payload}`)
        }
    }

    test('should get result when dispatch thunk', async () => {
        const { getBill } = createThunkMap(prefix, TestService)

        const result = await store.dispatch(getBill()).unwrap()
        expect(result.price).toEqual(2)
    })

    test('should throw error when dispatch thunk', async () => {
        const { deleteA } = createThunkMap(prefix, TestService)

        try {
            await store.dispatch(deleteA('a')).unwrap()
        } catch (error) {
            expect((error as Error).message.startsWith('error on deleting')).toBe(true)
        }
    })

    test('should skip creating thunk when skip is true', () => {
        const { deleteA } = createThunkMap(prefix, TestService, { deleteA: { skip: true } })
        expect(deleteA).toBeFalsy()
    })

    test('should run post handler when postHandler is set', async () => {
        const postHandler = jest.fn()
        const { getBill } = createThunkMap(prefix, TestService, {
            getBill: {
                postHandler
            }
        })
        await store.dispatch(getBill()).unwrap()
        expect(postHandler).toHaveBeenCalled()
    })
})
