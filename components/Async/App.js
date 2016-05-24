
import React, { Component } from 'react'
import { connect } from 'react-redux'

import { selectReddit, fetchPostsIfNeeded } from './actions.js'
import Picker from './picker.js'
import Posts from './posts.js'

class App extends Component {

	constructor() {
		super()
		this.handleChange = this.handleChange.bind(this)
	}

	componentDidMount() {
		const { dispatch, selectedReddit } = this.props
		dispatch(fetchPostsIfNeeded(selectedReddit))
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.selectedReddit != this.props.selectedReddit){
			const { dispatch, selectedReddit } = nextProps
			dispatch(fetchPostsIfNeeded(selectedReddit))
		}
	}

	handleChange(reddit) {
		const { dispatch } = this.props
		dispatch(selectReddit(reddit))	
	}

	render() {
		const { selectedReddit, posts } = this.props
		return (
			<div>
				<Picker value={selectedReddit} 
						options={['reactjs', 'frontend']}
						onChange={this.handleChange}/>
				<Posts posts={posts} />
			</div>
		)
	}

}

function mapStateToProps(state) {
	const { selectedReddit, postsByReddit } = state
	const {
		isFetching,
		lastUpdated,
		items: posts
	} = postsByReddit[selectedReddit] || {
		isFetching: true,
		items: []
	}
	return {
		selectedReddit,
		isFetching,
		lastUpdated,
		posts
	}
}

export default connect(mapStateToProps)(App)