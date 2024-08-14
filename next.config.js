/* eslint-disable */
const { version } = require('./package.json');

module.exports = {
    reactStrictMode: true,
    env: {
        version
    },
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
