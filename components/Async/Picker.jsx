import React, { Component } from 'react'

export default class Picker extends Component {

	render() {
		let options = this.props.options.map((option) => {
			return <option key={option}>{option}</option>
		})
		return (
			<select onChange={(e) => this.props.onChange(e.target.value)}>
				{options}
			</select>
		)
	}
	
}