import React from "react"
import { connect } from "react-redux"

type TaskListProps = {
	totalItems?: number,
	totalPageItems: number,
	onPageChange: (page: number) => void
}

type TaskListState = {
	pages: number,
	page: number
}

class TaskListPagination extends React.Component<TaskListProps, TaskListState> {
	constructor(props: TaskListProps) {
		super(props)
		this.state = {
			pages: 0,
			page: 1
		}
	}
	renderPages() {
		let pages = []
		for(let i=1; i<=this.state.pages; i++) {
			pages.push(<button
					type="button"
					onClick={()=>this.onPageChange(i)}
					className={`pagination-page-item ${ this.state.page === i ? 'pagination-page-item-active' : ''}`} key={i}>
						{i}
				</button>)
		}
		return (
			<div className="pagination-page-list">{pages}</div>
		)
	}
	onPageChange(i: number) {
		this.props.onPageChange(i)
		this.setState({ page: i })
	}
	componentDidMount() {
		if ( this.props.totalItems ) {
			this.setState({ pages: Math.round( this.props.totalItems / this.props.totalPageItems ) })
		}
	}
	render() {
		return <div>
			{this.renderPages()}
		</div>
	}
}

export default connect(null,null)(TaskListPagination)
