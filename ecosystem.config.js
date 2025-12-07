module.exports = {
  apps: [
    {
      name: "scraperusa_v2",
      script: "dist/scheduler/scheduler.js",
      cwd: "./",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
      },
    },
  ],

  deploy: {
    production: {
      user: "client_269_1",
      host: "64.71.161.251",

      key: "/home/client_269_1/.ssh/id_ed25519",

      ref: "origin/main",
      repo: "git@github.com:QuickLotter/scraperusa_v2.git",

      path: "/opt/scraperusa_v2",

      "pre-deploy-local": "",

      "post-deploy":
        "npm install && npm run build && pm2 reload ecosystem.config.js --only scraperusa_v2",
    },
  },
};
