module.exports = {
  apps: [
    {
      name: "scraperusa_v2",
      script: "source/dist/main.js",
      cwd: "/opt/scraperusa_v2",

      autorestart: false,
      watch: false,

      // CRON → rodar a cada 3 minutos
      cron_restart: "*/3 * * * *",

      exp_backoff_restart_delay: 0,
      env: {
        NODE_ENV: "production",
        SUPABASE_URL: "https://hlthyxpkwvfdqqrihlkg.supabase.co",
        SUPABASE_SERVICE_ROLE: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....",
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
        "npm install && npm run build && pm2 reload ecosystem.config.js --update-env --only scraperusa_v2",
    },
  },
};
