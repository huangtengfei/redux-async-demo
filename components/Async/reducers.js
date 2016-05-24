
import { combineReducers } from 'redux'

import { SELECTED_REDDIT, INVALIDATE_REDDIT, REQUEST_POSTS, RECEIVE_POSTS } from './actions.js'

// reducer: selectedReddit
function selectedReddit(state = 'reactjs', action) {
	switch(action.type) {
		case SELECTED_REDDIT:
			return action.reddit
		default:
			return state
	}
}

// inner function
function posts(state = {
	isFetching: false,
	didInvalidate: false,
	items: []
}, action) {
	switch(action.type) {
		case INVALIDATE_REDDIT:
			return Object.assign({}, state, {
				didInvalidate: true
			})
		case REQUEST_POSTS: 
			return Object.assign({}, state, {
				isFetching: true,
				didInvalidate: false
			})
		case RECEIVE_POSTS:
			return Object.assign({}, state, {
				isFetching: false,
				didInvalidate: false,
				items: action.posts,
				lastUpdated: action.receivedAt
			})
		default:
			return state
	}
}

// reducer: postsByReddit
function postsByReddit(state = {}, action) {
	switch(action.type) {
		case INVALIDATE_REDDIT:
		case REQUEST_POSTS:
		case RECEIVE_POSTS:
			return Object.assign({}, state, {
				[action.reddit]: posts(state[action.reddit], action)
			})
		default: 
			return state
	}
}

const rootReducer = combineReducers({
	selectedReddit,
	postsByReddit
})

export default rootReducer

