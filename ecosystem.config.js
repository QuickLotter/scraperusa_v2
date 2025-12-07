module.exports = {
  apps: [
    {
      name: "scraperusa_v2",

      // Arquivo compilado pelo TypeScript
      script: "dist/scheduler/scheduler.js",
      cwd: "./",

      instances: 1,
      exec_mode: "fork",

      autorestart: true,
      watch: false,
      max_memory_restart: "500M",

      ///////////////////////////////////////////////////////
      // CRON — Executa automaticamente a cada 3 minutos
      ///////////////////////////////////////////////////////
      cron_restart: "*/3 * * * *",

      ///////////////////////////////////////////////////////
      // LOG ROTATION PROFISSIONAL
      ///////////////////////////////////////////////////////
      max_size: "10M",
      merge_logs: true,
      time: true,

      ///////////////////////////////////////////////////////
      // AMBIENTE
      ///////////////////////////////////////////////////////
      env: {
        NODE_ENV: "production",

        // Supabase
        SUPABASE_URL: process.env.SUPABASE_URL,
        SUPABASE_SERVICE_ROLE: process.env.SUPABASE_SERVICE_ROLE,

        // Debug (mude para "true" quando quiser ver logs extras)
        DEBUG_SCHEDULER: "false",
      },
    },
  ],

  ///////////////////////////////////////////////////////
  // PM2 DEPLOY CONFIG — usado pelo VSCode ou terminal
  ///////////////////////////////////////////////////////
  deploy: {
    production: {
      user: "client_269_1",
      host: "64.71.161.251",

      // sem chave privada, usando senha
      ref: "origin/main",
      repo: "git@github.com:QuickLotter/scraperusa_v2.git",

      path: "/opt/scraperusa_v2",

      // Executado após baixar nova versão
      "post-deploy":
        "npm install && npm run build && pm2 reload ecosystem.config.js --only scraperusa_v2",
    },
  },
};
