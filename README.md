# Redux Async Demo

这是基于 [Redux Demo][1] 做的一个带有异步操作的示例，抓取 reddit 指定主题的帖子。

## 安装 & 运行：

```
git clone https://github.com/huangtengfei/redux-async-demo.git
cd redux-async-demo
npm install
npm run dev
```

打开 http://localhost:8080 即可看到效果。

Redux 的基础知识已经在 Redux Demo 中有讲过了，所以这里只讲一下两者不同的地方，即异步 action 的实现，并介绍整个 Demo 的实现过程。

## 如何将同步 Action Creator 和异步操作结合

可以使用 `redux thunk` middleware 来将同步 Action Creator 和异步操作结合。它使得 action creator 不仅能返回 action 对象，还能返回函数。返回的函数被 `redux thunk` middleware 执行，thunk 的结果可以再次被 dispatch。

使用 `redux thunk` middleware 需要先安装 `redux-thunk`

    npm install redux-thunk --save

下面是 thunk action creator 的定义方式：

```javascript
export fetchPosts(reddit) {
  return function(dispatch) {
    dispatch(requestPosts(reddit)) // 结合 requestPosts action creator
    return fetch('http://xxx/' + reddit + '.json')
      .then(resp => resp.json())
      .then(json => dispatch(receivePosts(reddit, json))) // 结合 receivePosts action creator 
  }
}
```

Thunk middleware 不是唯一实现异步 action 的方式，也可以使用 `redux-promise` 或 `redux-promise-middleware`，或者自己写一个。

## 实现过程

下面是整个 demo 的实现过程，参考 [Redux Demo][2] 的实现。

a. 设计 state

分析可知，本应用只有两种数据需要存储，即选中的主题和主题下的帖子，所以，state 的整体结构如下：

```javascript
{
    selectedReddit: 'reactjs',
    postsByReddit: {
        angularjs: {
            isFetching: true, // 是否正在抓取
            didInvalidate: false, // 数据是否过期
            items: [] // 列表
        },
        reactjs: {
            isFetching: false,
            didInvalidate: false,
            lastUpdated: 1439478405547
            items: [{
                id: 233,
                title: 'Confusion about Flux and Relay'
            },{
                id: 234,
                title: 'How to build a Redux App'
            }]
        }
    }
    
}
```

b. 设计 actions

本应用的 actions 分成两块，一块是用户控制的，一块是网络请求触发的。

用户控制：

 - 选择要显示的 reddit：SELECTED_REDDIT
 - 刷新 reddit 列表：INVALIDATE_REDDIT

网络：

 - 发出请求：REQUEST_POSTS
 - 请求响应：RECEIVE_POSTS

这些 Actions 和 Action Creators 都是同步的，要将它们和异步的网络操作结合起来，这些处理在 actions 文件中使用 `redux-thunk` middleware 完成。

c. 设计 reducers

根据第一步设计的 state 可知，在最顶层有两个字段，即 `selectedReddit` 和 `postsByReddit`，所以设计为使用两个 reducer 处理

```javascript
const rootReducer = combineReducers({
  selectedReddit,
  postsByReddit
})
```

另外，由于 `postsByReddit` 的结构比较复杂，所以对其内层单独使用一个 reducer 处理。

d. 在入口文件中连接 actions 和 reducers

创建一个 store，连接 actions 和 reducers，在创建 store 的时候，应用中间件。

中间件的使用方式：

```javascript
import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import rootReducer from './reducers'

const store = createStore(
    rootReducers,
    applyMiddleware(
        thunkMiddleware,
        ...
    )
)
```

在无界面的情况下，测试数据处理逻辑：

```javascript
store.dispatch(selectReddit('reactjs'))
store.dispatch(fetchPostsIfNeeded('reactjs')).then(() =>
  console.log(store.getState())
)
```

e. 写 React 组件。展示组件拆分成 Picker 和 Posts ，前者用来选择主题，后者用来显示选中主题下的帖子。在容器组件中将这两个展示组件进行封装，并根据异步请求的结果，显示一些提示信息。

f. 连接到 Redux。在使用 connect 连接 React 组件和 Redux 时，可以传递一个 mapStateToProps，对从 Redux store 得到的全局 state 进行过滤，返回组件所需要的 props 。

## 补充 & 进阶

### [减少样板代码][3]

有以下几种办法：

- 写 action creator 生成函数，或使用 `redux-actions`，生成 action creators
- 用中间件处理复杂 actions（比如要进行异步操作的 actions）
- 写 reducer 生成函数，生成 reducers

### [服务器端渲染][4]

第一次请求时，使用服务器端渲染。当服务器收到请求后，把需要的组件渲染成 HTML 字符串返回给客户端。之后客户端接手渲染。

Redux 在服务器端要做的事情就是，提供初始 state，通常是添加一个 `script` 标签，把 `initialState` 赋给 `window.__INITIAL_STATE__`

### [编写测试][5]

需要对以下模块编写测试：

- action creators
- reducers
- components
- middlewares

### [Redux API][6]

顶级 API 有以下五个：

- `createStore(reducer, [initialState])` 创建一个 Redux store
- `combineReducers(...reducers)` 合并 reducers
- `applyMiddleware(...middlewares)` 应用中间件，扩展 dispatch
- `bindActionCreators(actionCreator, dispatch)` 使用 dispatch 包装 action creator
- `componse(...functions)` 从右到左组合函数

顶级 API 可以直接这样引入：

    import { createStore } from 'redux'

## 参考

[Redux 教程高级篇][7]


  [1]: https://github.com/huangtengfei/redux-demo
  [2]: https://github.com/huangtengfei/redux-demo
  [3]: http://cn.redux.js.org/docs/recipes/ReducingBoilerplate.html
  [4]: http://cn.redux.js.org/docs/recipes/ServerRendering.html
  [5]: http://cn.redux.js.org/docs/recipes/WritingTests.html
  [6]: http://cn.redux.js.org/docs/api/index.html
  [7]: http://cn.redux.js.org/docs/advanced/index.html