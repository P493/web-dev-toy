# web-dev-toy
 some fun for web dev

## redux

### createSelectorMap

If there is a selector to select object `obj`, no more repeating call to `createSelector` for selecting its props like `obj.foo` and `obj.bar`, use this sugar to reduce boilerplate code and get less re-render  
如果已经有取出对象 `obj` 的 selector，不用再重复调用 `createSelector` 以取出其属性类似 `obj.foo` 和 `obj.bar`，使用此函数以减少样板代码同时减少 re-render

```javascript
/* avoid */
function ChildA() {
    const { foo } = useSelector(selectObj)
}

/* prefer */
function ChildA() {
    const foo = useSelector(selectFoo)
}
```

### createThunkMap

If your project is using redux thunk and having dedicated api client like some api service layer, refer to this sugar to reduce boilerplate code  
如果项目中使用了 redux thunk 并且有独立的 api client 比如一些 api 的服务层，参考此函数以减少样板代码
