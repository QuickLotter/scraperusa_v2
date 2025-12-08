module.exports = {
  apps: [
    {
      name: "scraperusa_v2",

      script: "dist/main.js",
      cwd: "/opt/scraperusa_v2",

      // EVITA LOOP INFINITO
      autorestart: false,
      watch: false,

      // Executa somenta via CRON
      cron_restart: "*/5 * * * *",

      // Não tenta reiniciar sozinho
      exp_backoff_restart_delay: 0,

      env: {
        NODE_ENV: "production",
        SUPABASE_URL: "https://hlthyxpkwvfdqqrihlkg.supabase.co",
        SUPABASE_SERVICE_ROLE:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhsdGh5eHBrd3ZmZHFxcmlobGtnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTI0OTA5OCwiZXhwIjoyMDYwODI1MDk4fQ.RzAcPSydnO7ibM9-Zf9r2QGHIj-9MchwjmN-C3ZIPok",
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
