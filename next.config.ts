import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'media.qianliaowang.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'img.qlchat.com',
                pathname: '/**',
            },
        ],
    },
    logging: {
        fetches: {
            fullUrl: true,
        },
        incomingRequests: true,
    },
};

export default nextConfig;
