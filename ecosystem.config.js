module.exports = {
  apps: [
    {
      name: "scraperusa_v2",

      // Caminho do arquivo compilado pelo TypeScript
      script: "dist/main.js",
      cwd: "/opt/scraperusa_v2",

      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",

      // CRON — executa o ciclo a cada 3 minutos
      cron_restart: "*/3 * * * *",

      // ROTATE LOGS
      max_size: "10M",
      merge_logs: true,
      time: true,

      /////////////////////////////////////////////////////////
      // VARIÁVEIS DE AMBIENTE (DIRETAMENTE NO ECOSYSTEM)
      // ESSA É A FORMA CORRETA PARA PM2 PASSAR AS ENVs
      /////////////////////////////////////////////////////////
      env: {
        NODE_ENV: "production",

        // 🔵 URL CORRETA DO SEU PROJETO SUPABASE
        SUPABASE_URL: "https://hlthyxpkwvfdqqrihlkg.supabase.co",

        // 🔵 SERVICE ROLE COMPLETA (COLE A SUA AQUI)
        SUPABASE_SERVICE_ROLE:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhsdGh5eHBrd3ZmZHFxcmlobGtnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTI0OTA5OCwiZXhwIjoyMDYwODI1MDk4fQ.RzAcPSydnO7ibM9-Zf9r2QGHIj-9MchwjmN-C3ZIPok",
      },
    },
  ],

  ////////////////////////////////////////////////////////////////////
  // DEPLOY CONFIG — APENAS SE USAR PM2 DEPLOY (opcional)
  ////////////////////////////////////////////////////////////////////
  deploy: {
    production: {
      user: "client_269_1",
      host: "64.71.161.251",
      ref: "origin/main",
      repo: "git@github.com:QuickLotter/scraperusa_v2.git",

      // Diretório onde o deploy será feito
      path: "/opt/scraperusa_v2",

      // Comandos após o git pull
      "post-deploy":
        "npm install && npm run build && pm2 reload ecosystem.config.js --update-env --only scraperusa_v2",
    },
  },
};
