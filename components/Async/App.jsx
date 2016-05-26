
import React, { Component } from 'react'
import { connect } from 'react-redux'

import { selectReddit, invalidateReddit, fetchPostsIfNeeded } from './actions.js'
import Picker from './Picker.jsx'
import Posts from './Posts.jsx'

class App extends Component {

	constructor() {
		super()
		this.handleChange = this.handleChange.bind(this)
		this.handleClick = this.handleClick.bind(this)
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

	handleClick() {
		const { dispatch, selectedReddit } = this.props
		dispatch(invalidateReddit(selectedReddit))
		dispatch(fetchPostsIfNeeded(selectedReddit))
	}

	render() {
		const { selectedReddit, posts, lastUpdated, isFetching } = this.props
		return (
			<div>
				<Picker value={selectedReddit} 
						options={['reactjs', 'frontend']}
						onChange={this.handleChange}/>
				<p>
					{lastUpdated && 
						<span>Last Updated at {new Date(lastUpdated).toLocaleTimeString()} {'  '}</span>
					}
					{!isFetching &&
						<a href="#" onClick={this.handleClick}>Refresh</a>
					}
				</p>	
				{isFetching && posts.length === 0 && 
					<h2>Loading...</h2>
				}	
				{!isFetching && posts.length === 0 &&
					<h2>Empth</h2>
				}
				{posts.length > 0 &&
					<div style={{opacity: isFetching ? 0.5 : 1}}>
						<Posts posts={posts} />
					</div>
				}
				
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