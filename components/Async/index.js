
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import { createStore, applyMiddleware } from 'redux'

import rootReducer from './reducers.js'
import { selectReddit, fetchPostsIfNeeded } from './actions.js'

const loggerMiddleware = createLogger()

const store = createStore(
	rootReducer,
	applyMiddleware(
		thunkMiddleware,
		loggerMiddleware
	)
)

store.dispatch(selectReddit('reactjs'))
store.dispatch(fetchPostsIfNeeded('reactjs')).then(() =>
	console.log(store.getState())
)