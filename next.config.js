const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		formats: ['image/avif', 'image/webp'],
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'i.ytimg.com',
				pathname: '/**',
			},
		],
	},
	reactStrictMode: true,
	pageExtensions: ['md', 'mdx', 'tsx', 'ts', 'jsx', 'js'],
	experimental: {
		optimizeCss: true,
		mdxRs: true,
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	webpack(config, { isServer }) {
		if (!isServer) {
			config.resolve.fallback = {
				...config.resolve.fallback,
				canvas: false,
				encoding: false,
			}
		}

		return config
	},
	async redirects() {
		return []
	},
}

module.exports = withBundleAnalyzer(nextConfig)
