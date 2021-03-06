import {
	shell,
} from "electron";

import * as React from "react";

import {
	observer,
} from "mobx-react";

// import { ProjectStore } from "../stores/ProjectStore";
// import { UIStore } from "../stores/UIStore";

import {
	Project as ProjectData,
} from "../models/Project";

import {
	AppStore,
} from "../stores/AppStore";

const css = require("./Project.less");

const classNames = require("classNames");

@observer(["appStore"])
export class Project extends React.Component<{ appStore?: AppStore, project: ProjectData }, {}> {
	handlePlay = () => {
		this.props.project.start();
	}

	handleStop = () => {
		this.props.project.stop();
	}

	handleRemove = () => {
		this.props.appStore!.removeProject(this.props.project);
	}

	handleOpenProject = () => {
		const { root } = this.props.project;

		shell.openExternal(`file://${root}`);
	}

	handlePreview = (e: React.MouseEvent) => {
		e.stopPropagation();
		e.preventDefault();
		shell.openExternal(this.getPreviewURL());
	}

	handleBundle = () => {

	}

	getPreviewURL() {
		const {
			port,
		} = this.props.project!;

		return `http://localhost:${port}`;
	}

	render() {
		const {
			status,
			prettyRoot,
			name,
			message,
			progress,
			errors,
		} = this.props.project!;

		let primaryAction: any;
		if (Object.is(status, "success") || Object.is(status, "building") || Object.is(status, "error")) {
			primaryAction = (
				<a className={css.action} onClick={this.handleStop}>
					<span className={classNames(css.action__icon, "fa", "fa-pause")} />
				</a>
			);
		} else if (Object.is(status, "stopped")) {
			primaryAction = (
				<a className={css.action} onClick={this.handlePlay}>
					<span className={classNames(css.action__icon, "fa", "fa-play")} />
				</a>
			);
		}

		return (
			<div className={classNames(css.root, css[`root--${status}`])}>
				<a onClick={this.handleOpenProject}>
					<span className={css.timeAgo}> {prettyRoot} </span>
				</a>
				<h1 className={css.title}> {name} </h1>

				<div className={css.tools}>
					{
						Object.is(status, "building") &&
						<div className={css.tools__item}>
							{message}
						</div>
					}

					{
						Object.is(status, "stopped") &&
						<div className={css.tools__item}>
							<span className={classNames(css.tools__item__icon, "fa", "fa-trash-o")} />
							<a onClick={this.handleRemove}>Remove</a>
						</div>
					}

					{
						Object.is(status, "success") &&
						<div className={css.tools__item}>
							<span className={classNames(css.tools__item__icon, "fa", "fa-link")} />
							<a href={this.getPreviewURL()} onClick={this.handlePreview}>Preview</a>
						</div>
					}

					{
						Object.is(status, "success") &&
						<div className={css.tools__item}>
							<span className={classNames(css.tools__item__icon, "fa", "fa-gift")} />
							<a onClick={this.handleBundle}>Bundle</a>
						</div>
					}

					{
						Object.is(status, "error") &&
						<div className={css.tools__item}>
							<span className={classNames(css.tools__item__icon, "fa", "fa-exclamation-triangle")} />
							<a onClick={this.handleBundle}>Errors ({errors.length})</a>
						</div>
					}

					{/* there is currently no way to trigger rebuild
						{
						Object.is(status, "error") &&
						<div className={css.tools__item}>
							<span className={classNames(css.tools__item__icon, "fa", "fa-wrench")} />
							<a onClick={this.handleBundle}>Rebuild</a>
						</div>
						}
					*/}


				</div>

				{primaryAction}


			</div>
		);
	}
}

