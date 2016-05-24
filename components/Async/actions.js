
// action types

export const SELECTED_REDDIT = 'SELECTED_REDDIT'
export const INVALIDATE_REDDIT = 'INVALIDATE_REDDIT'
export const REQUEST_POSTS = 'REQUEST_POSTS'
export const RECEIVE_POSTS = 'RECEIVE_POSTS'

// action creator: selectReddit
export function selectReddit(reddit) {
	return {
		type: SELECTED_REDDIT,
		reddit
	}
}

// action creator: invalidateReddit
export function invalidateReddit(reddit) {
	return {
		type: INVALIDATE_REDDIT,
		reddit
	}
}

// action creator: requestPosts
export function requestPosts(reddit) {
	return {
		type: REQUEST_POSTS,
		reddit
	}
}

// action creator: receivePosts
export function receivePosts(reddit, json) {
	return {
		type: RECEIVE_POSTS,
		reddit,
		posts: json.data.children.map(child => child.data),
		receivedAt: Date.now()
	}
}

function fetchPosts(reddit) {
	return function(dispatch) {
		dispatch(requestPosts(reddit))
		return fetch('http://www.subreddit.com/r/' + reddit + '.json')
			.then(resp => resp.json())
			.then(json => dispatch(receivePosts(reddit, json)))
	}
}

function shouldFetchPosts(state, reddit) {
	const posts = state.postsByReddit[reddit]
	if(!posts){
		return true
	}else if(posts.isFetching){
		return false
	}else {
		return posts.didInvalidate
	}
}

// chunk action creator
export function fetchPostsIfNeeded(reddit) {
	return (dispatch, getState) => {
		if(shouldFetchPosts(getState(), reddit)){
			return dispatch(fetchPosts(reddit))
		}else {
			return Promise.resolve()
		}
	}
}



