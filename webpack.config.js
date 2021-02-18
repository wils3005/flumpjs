import Path from "path";
import WebpackNodeExternals from "webpack-node-externals";

const base = {
  devtool: "source-map",
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(css|gif|html|jpe?g|ico|json|m4a|mp3|ogg|png|svg)$/i,
        type: "asset/resource",
      },
      {
        exclude: /node_modules/,
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          configFile: Path.join(__dirname, "tsconfig.build.json"),
        },
      },
    ],
  },
  output: {
    assetModuleFilename: "[name][ext]",
    globalObject: "this",
    path: Path.join(__dirname, "dist"),
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
};

const server = {
  ...base,
  entry: {
    server: Path.join(__dirname, "src", "index.ts"),
  },
  externalsPresets: { node: true },
  externals: [WebpackNodeExternals()],
  target: "node",
};

const client = {
  ...base,
  entry: {
    app: Path.join(__dirname, "src", "client", "index.ts"),
  },
  output: {
    assetModuleFilename: "[name][ext]",
    globalObject: "this",
    path: Path.join(__dirname, "dist", "client"),
  },
};

const config = [server, client];

export default config;
