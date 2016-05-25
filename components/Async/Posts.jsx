
import React, { Component } from 'react'

export default class Posts extends Component {

	render() {
		let posts = this.props.posts.map((post, index) => {
			return <li key={index}>{post.title}</li>
		})
		return (
			<ul>
				{posts}
			</ul>
		)
	}

}