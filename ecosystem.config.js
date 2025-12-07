// Carrega .env antes de tudo
require("dotenv").config();

module.exports = {
  apps: [
    {
      name: "scraperusa_v2",
      script: "dist/scheduler/scheduler.js",
      cwd: "./",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",

      cron_restart: "*/3 * * * *",

      env: {
        NODE_ENV: "production",
        SUPABASE_URL: process.env.SUPABASE_URL,
        SUPABASE_SERVICE_ROLE: process.env.SUPABASE_SERVICE_ROLE,
        DEBUG_SCHEDULER: "false",
      },
    },
  ],

  deploy: {
    production: {
      user: "client_269_1",
      host: "64.71.161.251",
      ref: "origin/main",
      repo: "git@github.com:QuickLotter/scraperusa_v2.git",
      path: "/opt/scraperusa_v2",
      "post-deploy":
        "npm install && npm run build && pm2 reload ecosystem.config.js --only scraperusa_v2",
    },
  },
};
