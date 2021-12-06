import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { connect } from "react-redux"

import { RootState, store } from "../../../app/store"
import { fetchTasksByPage, GetListQueryParams, SortDirectionType, SortFieldType, getStatus } from "../api"
import { isLogin } from "../../user/api"
import { ITask } from "../Task"
import { changeQueryParams, editTask } from "../reducer"
import TaskListPagination from "./TaskListPagination"

type TaskListProps = {
	taskList: Array<ITask>
	successStatus: string | boolean
	totalCount?: number,
	getListQueryParams: GetListQueryParams,
	editTask?: ITask
}

type TaskListState = {}

const EditButton = ({ ...props }) => {
	const navigator = useNavigate()
	return <div>
		{isLogin() ? <button className="edit-btn" onClick={async () => {
			await store.dispatch(editTask({
				...props.task,
				emailValid: true,
				usernameValid: true,
				textValid: true
			}))
			navigator('/edit')
		}}>Редактировать</button> : null}
	</div>
}

class TaskList extends React.Component<TaskListProps, TaskListState> {
	constructor(props: TaskListProps) {
		super(props)
	}
	async componentDidMount() {
		await store.dispatch(fetchTasksByPage({
			sortField: this.props.getListQueryParams.sortField,
			sortDirection: this.props.getListQueryParams.sortDirection,
			pageNum: this.props.getListQueryParams.pageNum
		}))
		console.log(this.props.successStatus)
	}
	async onPageChange(pageNum: number) {
		await store.dispatch(changeQueryParams({ pageNum }))
		store.dispatch(fetchTasksByPage({
			sortField: this.props.getListQueryParams.sortField,
			sortDirection: this.props.getListQueryParams.sortDirection,
			pageNum
		}))
	}
	async onChangeSortDirection(sortDirection: SortDirectionType) {
		await store.dispatch(changeQueryParams({ sortDirection }))
		store.dispatch(fetchTasksByPage({
			sortField: this.props.getListQueryParams.sortField,
			sortDirection,
			pageNum: this.props.getListQueryParams.pageNum
		}))
	}
	async onChangeSortFieldDirection(sortField: SortFieldType) {
		await store.dispatch(changeQueryParams({ sortField }))
		store.dispatch(fetchTasksByPage({
			sortField,
			sortDirection: this.props.getListQueryParams.sortDirection,
			pageNum: this.props.getListQueryParams.pageNum
		}))
	}
	render() {
		return <div className="task-list-content">
			{this.props.successStatus !== '' ? (<p className="success-message">{this.props.successStatus}</p>) : null}
			<div className="task-list-order">
				<Link className="create-task-btn" to="/create">Создать задачу</Link>
				<select onChange={(e) => this.onChangeSortDirection(e.target.value as SortDirectionType)}>
					<option value={"asc"}>По возрастанию</option>
					<option value={"desc"}>По убыванию</option>
				</select>
				<select onChange={(e) => this.onChangeSortFieldDirection(e.target.value as SortFieldType)}>
					<option value={"username"}>Имя пользователя</option>
					<option value={"email"}>E-Mail</option>
					<option value={"status"}>Статус</option>
				</select>
			</div>
			<div className="task-list">
				{this.props.taskList.map((task: ITask, key) => {
					return (
						<div className="list-item" key={key}>
							<div className="list-item-header">
								<span className="list-item-id">#{task.id}</span>
								<span className="list-item-username">Пользователь: {task.username}</span>
								<EditButton {...this.props} task={task} />
							</div>
							<div className="list-item-text">
								{task.text}
							</div>
							<div className="list-item-footer">
								<span>E-mail: {task.email}</span>
								<span className={task.status === 10 ? 'text-green' : ''}>Статус: {getStatus(task.status)}</span>
							</div>
						</div>
					)
				})}
			</div>
			<div>
				{this.props.totalCount ? <TaskListPagination
					totalItems={this.props.totalCount}
					totalPageItems={3}
					onPageChange={(pageNum) => this.onPageChange(pageNum)}
				/> : null}
			</div>
		</div>
	}
}

export default connect((state: RootState) => ({
	taskList: state.task.taskList,
	successStatus: state.task.successStatus,
	totalCount: state.task.totalCount,
	getListQueryParams: state.task.getListQueryParams,
	editTask: state.task.editTask
}))(TaskList)
