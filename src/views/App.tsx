import * as qfs from "q-io/fs";
import * as path from "path";

import * as React from "react";

const ReactCSSTransitionGroup = require("react-addons-css-transition-group");

import {
	observer,
} from "mobx-react";

import { AppStore } from "../stores/AppStore";
import { UIStore } from "../stores/UIStore";

const ASSETS = {
	logo: require("../assets/logo.png"),
};

const css = require("./App.less");

import { Project } from "./Project";

@observer(["appStore", "uiStore"])
export class App extends React.Component<{ appStore?: AppStore, uiStore?: UIStore }, {}> {
	flash(message: string) {
		this.props.uiStore!.setFlashMessage(message);
	}

	onDrop = async (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();

		const files = e.dataTransfer.files;
		if (files.length !== 1) {
			this.flash("Please drop a single project folder");
			return;
		}

		const projectRoot = files[0].path;

		try {
			await this.props.appStore!.addProject(projectRoot);
		} catch (error) {
			this.flash(error.message);
		}

		return false;
	}

	render() {
		const {
			projects,
		} = this.props.appStore!;

		const {
			message,
		} = this.props.uiStore!;

		// const serverURL = `http://localhost:${port}`;

		return (
			<div className={css.root}
				onDrop={this.onDrop}>
				<div className={css.header}>
					<img className={css.header__logo} src={ASSETS.logo} />
					<h1 className={css.header__title}> PackPackGo </h1>
				</div>

				<DropZone />

				{projects.map(project => <Project key={project.root} project={project} />)}

				<ReactCSSTransitionGroup
					className={css.notice}
					transitionName={{
						enter: "fadeInDown",
						leave: "fadeOutUp",
					}}
					transitionEnterTimeout={3000}
					transitionLeaveTimeout={3000}
					>
					{
						message &&
						<div key="message" className={`${css.notice__message} animated`}>
							{message}
						</div>
					}
				</ReactCSSTransitionGroup>

			</div>
		);
	}
}

@observer(["appStore", "uiStore"])
class DropZone extends React.Component<{ appStore?: AppStore, uiStore?: UIStore }, {}> {
	render() {
		return (
			<div className={css.dropZoneHint}>
				Drop Your Project Here
			</div>
		);
	}
}
