// vercel.config.js
module.exports = {
  // This sets the landing page as the main entry point
  rewrites: async () => {
    return [
      {
        source: "/",
        destination: "/landingpage.html",
      },
      {
        source: "/api/:path*",
        destination: "/server.js",
      },
    ];
  },
};
