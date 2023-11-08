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

## tamper monkey

###  simple-script-patcher

If you just want to easily intercept and edit/modify some lines of script on a web page, without devtools open, without browser extension ([firefox has extension api](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/filterResponseData) to do it, but not for chrome), not by http-proxy/man-in-the-middle, could try this simple tamper monkey script. The in-line script method has limitations but generally available  
如果只是想简单地拦截并修改网页上一点脚本代码，不开 devtools，不用浏览器插件（firefox 有对应插件 api，chrome 则无），不通过 http 代理/中间人，可以试试这个简单的油猴脚本。内联脚本的方式虽有一些限制但一般可用
