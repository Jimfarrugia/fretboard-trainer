/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/a/**",
      },
    ],
  },
  async headers() {
    // Strict CSP
    // + https://va.vercel-scripts.com added for Vercel Speed Insights
    // + data: lh3.googleusercontent.com; added for Google profile images
    // + https://www.youtube.com; added for YouTube player embeds
    const cspHeader = `
        default-src 'self';
        script-src 'self' 'unsafe-eval' 'unsafe-inline' https://va.vercel-scripts.com;
        style-src 'self' 'unsafe-inline';
        img-src 'self' blob: data: lh3.googleusercontent.com;
        font-src 'self';
        object-src 'none';
        base-uri 'self';
        form-action 'self';
        frame-src 'self' https://www.youtube.com;
        frame-ancestors 'none' https://www.youtube.com;
        upgrade-insecure-requests;
    `;

    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader.replace(/\n/g, ""),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
