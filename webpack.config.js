const createExpoWebpackConfigAsync = require("@expo/webpack-config");
const path = require("path");

module.exports = async function (env, argv) {
    const config = await createExpoWebpackConfigAsync(env, argv);

    config.resolve.alias["@/contexts"] = path.resolve(__dirname, "contexts");
    config.resolve.alias["@/styles"] = path.resolve(__dirname, "styles");
    config.resolve.alias["@/components"] = path.resolve(
        __dirname,
        "components"
    );
    config.resolve.alias["@/screens"] = path.resolve(__dirname, "screens");
    config.resolve.alias["@/utils"] = path.resolve(__dirname, "utils");
    config.resolve.alias["@/assets"] = path.resolve(__dirname, "assets");
    config.resolve.alias["@/services"] = path.resolve(__dirname, "services");

    return config;
};
