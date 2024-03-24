/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['three'],
    webpack: (config, { isServer }) => {
        // Adds support for importing GLSL files
        config.module.rules.push({
            test: /\.(glsl|vs|fs|vert|frag)$/,
            exclude: /node_modules/,
            use: ['raw-loader']
        })
        return config
    }
};

export default nextConfig;
