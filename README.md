# Redux Async Demo

这是基于 [Redux Demo][1] 做的一个带有异步操作的示例。

## 安装 & 运行：

```javascript
git clone https://github.com/huangtengfei/redux-async-demo.git
cd redux-async-demo
npm install
npm run dev
```

打开 http://localhost:8080 即可看到效果。

Redux 的基础知识已经在 Redux Demo 中有讲过了，所以这里只 讲一下两者不同的地方，即异步 action 的实现，并介绍整个 Demo 的实现过程。

## 如何将同步 Action Creator 和 异步操作结合

借助于 Redux Thunk middleware，可以使得 action creator 不仅能返回 action 对象，还能返回函数。返回的函数被 Redux Thunk middleware 执行，thunk 的结果可以再次被 dispatch。

下面是 thunk action creator 的定义方式：

```javascript
export fetchPosts(reddit) {
  return function(dispatch) {
    dispatch(requestPosts(reddit))
    return fetch('http://www.subreddit.com/r/' + reddit + '.json')
      .then(resp => resp.json())
      .then(json => dispatch(receivePosts(reddit, json)))
  }
}
```

Thunk middleware 不是唯一实现异步 action 的方式，也可以使用 `redux-promise` 或 `redux-promise-middleware`，或者自己写一个。

## 实现过程

a. 设计 state

```javascript
{
    selectedReddit: 'f2e',
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

用户控制：

 - 选择要显示的 reddit：SELECTED_REDDIT
 - 刷新 reddit 列表：INVALIDATE_REDDIT

网络

 - 发出请求：REQUEST_POSTS
 - 请求响应：RECEIVE_POSTS

这些 Actions 和 Action Creators 都是同步的，要将它们和异步的网络操作结合起来，这些处理在 actions 文件中完成

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

## 补充

### 网络请求失败的处理

### 嵌套的API相应数据范式化

  [1]: https://github.com/huangtengfei/redux-demo