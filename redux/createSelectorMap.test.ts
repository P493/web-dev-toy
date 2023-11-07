import { createSelectorMap } from './createSelectorMap'

describe('createSelectorMap', () => {
    interface ITestState {
        bill: {
            price: number
            qty: number
        }
    }
    const initialState: ITestState = {
        bill: {
            price: 2,
            qty: 3,
        },
    }
    const selectBill = (state: ITestState) => state.bill

    test('should create selector map', () => {
        const billSelectorMap = createSelectorMap(selectBill, initialState.bill)
        expect(billSelectorMap.price(initialState)).toEqual(2)
    })

    test('should create selector map with replaced props', () => {
        const billSelectorMap = createSelectorMap(selectBill, initialState.bill, {
            price: (bill) => bill.price * 100,
        })
        expect(billSelectorMap.price(initialState)).toEqual(200)
    })

    test('should create selector map with custom props', () => {
        const billSelectorMap = createSelectorMap(selectBill, initialState.bill, {
            total: (bill) => bill.price * bill.qty,
        })
        expect(billSelectorMap.total(initialState)).toEqual(6)
    })
})
