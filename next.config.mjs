import withSerwistInit from "@serwist/next";

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
    // + https://www.youtube.com; added for YouTube player embeds
    const cspHeader = `
        default-src 'self';
        script-src 'self' 'unsafe-eval' 'unsafe-inline';
        style-src 'self' 'unsafe-inline';
        img-src 'self' blob: data:;
        font-src 'self';
        object-src 'none';
        base-uri 'self';
        form-action 'self';
        frame-src 'self' https://www.youtube.com;
        frame-ancestors 'self' https://www.youtube.com;
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

const withSerwist = withSerwistInit({
  swSrc: "/src/app/sw.ts", // where the service worker src is
  swDest: "public/sw.js", // where the service worker code will end up
  reloadOnOnline: true,
});

export default withSerwist(nextConfig);
