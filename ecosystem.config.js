module.exports = {
  apps: [
    {
      name: "scraperusa_v2",

      // Arquivo compilado pelo TypeScript
      script: "dist/scheduler/scheduler.js",
      cwd: "./",

      // 1 processo é suficiente para scrapers
      instances: 1,
      exec_mode: "fork",

      // Reinicia automaticamente se travar
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",

      // CRON — executa o ciclo a cada 2 minutos
      cron_restart: "*/2 * * * *",

      // ROTATE LOGS
      max_size: "10M",
      merge_logs: true,
      time: true,

      ////////////////////////////////
      // VARIÁVEIS DE AMBIENTE
      ////////////////////////////////
      env: {
        NODE_ENV: "production",

        // ------ SUPABASE ------
        SUPABASE_URL: process.env.SUPABASE_URL,
        SUPABASE_SERVICE_ROLE: process.env.SUPABASE_SERVICE_ROLE,

        // ------ DEBUG ------
        DEBUG_SCHEDULER: "false", // "true" para ativar logs extras
      },
    },
  ],

  ////////////////////////////////////////////////////
  // PM2 DEPLOY CONFIG — para deploy pelo VSCode/PM2
  ////////////////////////////////////////////////////
  deploy: {
    production: {
      user: "client_269_1",
      host: "64.71.161.251",

      // usando senha, não chave SSH
      ref: "origin/main",
      repo: "git@github.com:QuickLotter/scraperusa_v2.git",

      // Diretório de releases do PM2
      path: "/opt/scraperusa_v2",

      // Comandos executados após o GIT pull
      "post-deploy":
        "npm install && npm run build && pm2 reload ecosystem.config.js --only scraperusa_v2",
    },
  },
};
