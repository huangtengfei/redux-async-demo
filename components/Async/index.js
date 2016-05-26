import React from 'react'
import { render } from 'react-dom' 
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import { createStore, applyMiddleware } from 'redux'

import rootReducer from './reducers.js'
import { selectReddit, fetchPostsIfNeeded } from './actions.js'
import App from './App.jsx'

const loggerMiddleware = createLogger()

const store = createStore(
	rootReducer,
	applyMiddleware(
		thunkMiddleware,
		loggerMiddleware
	)
)

render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('app')
) 