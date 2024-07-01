module.exports = {
    reactStrictMode: true,
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: [
                {
                    loader: '@svgr/webpack',
                    options: {
                        svgo: false
                    }
                }
            ]
        })
        return config
    },
    typescript: {
        ignoreBuildErrors: true
    }
}
