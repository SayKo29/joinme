module.exports = function (api) {
    api.cache(true);
    return {
        presets: ["babel-preset-expo"],
        plugins: [
            "react-native-reanimated/plugin",
            [
                "module-resolver",
                {
                    alias: {
                        "@/contexts": "./contexts",
                        "@/styles": "./styles",
                        "@/components": "./components",
                        "@/screens": "./screens",
                        "@/lib": "./lib",
                        "@/assets": "./assets",
                        "@/services": "./services",
                        "@/api": "./api",
                        "@/store": "./store",
                        "@/navigation": "./navigation",
                    },
                },
            ],
            "module:react-native-dotenv",
        ],
    };
};
