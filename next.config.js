/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
        domains: ['images.unsplash.com'],
    },
    webpack: (config, { isServer }) => {
        config.module.rules.push({
            test: /supabase\/functions\/.*/,
            loader: 'ignore-loader',
        });
        return config;
    },
    experimental: {
        serverComponentsExternalPackages: [],
    },
};



module.exports = nextConfig;