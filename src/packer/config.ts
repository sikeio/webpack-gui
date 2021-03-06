import * as path from "path";
import * as qfs from "q-io/fs";

const ProgressPlugin = require("webpack/lib/ProgressPlugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

import { Project } from "../models/Project";

export async function configureWebpack(project: Project) {
	const { root } = project;

	const progressPlugin = new ProgressPlugin(project.updateProgress.bind(project));

	// TODO provide a default template if one is not included in project

	let htmlTemplate: string = path.join(root, "index.html");
	if (!await qfs.exists(htmlTemplate)) {
		htmlTemplate = path.join(__packagedir, "preview-react.html");
	}

	const htmlPlugin = new HtmlWebpackPlugin({
		title: project.name,
		template: htmlTemplate,
	});

	const config = {
		entry: {
			index: path.join(root, "index.js"),
		},

		output: {
			path: path.join(root, "build"),
			filename: "[name].js",
			publicPath: "/",
		},

		resolve: {
			extensions: ["", ".css", ".js", ".jsx", ".json"],
		},

		module: {
			loaders: [
				{
					test: /\.jsx?$/,
					loaders: ["babel"],
					exclude: [/node_modules/],
				},
				{
					test: /\.vue$/,
					loaders: ["vue"],
				},
				{
					test: /\.json$/,
					loaders: ["json"],
				},
				{
					test: /\.svg$/,
					loaders: ["svg-inline"],
				},
			],
		},

		// devtool: "cheap-module-eval-source-map",
		devtool: "source-map",

		babel: {
			babelrc: false,
			plugins: [
				"transform-es2015-modules-commonjs",
			],
			presets: [
				"es2017",
				"stage-1",
				"react",
			],
		},

		plugins: [
			progressPlugin,
			htmlPlugin,
		],
	};

	return config;
}
