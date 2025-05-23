/* eslint-disable */
const { version } = require('./package.json');
const path = require('path');

module.exports = {
    reactStrictMode: true,
    env: { version },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: "**",
            }
        ]
    },
    sassOptions: {
        includePaths: [path.join(__dirname, 'src/styles')]
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
