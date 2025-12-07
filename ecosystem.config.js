module.exports = {
  apps: [
    {
      name: "scraperusa_v2",
      script: "dist/scheduler/scheduler.js",
      cwd: "/opt/scraperusa_v2",
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

      ref: "origin/main",
      repo: "git@github.com:QuickLotter/scraperusa_v2.git",

      // 🟩 Onde o PM2 colocará o código ao fazer deploy
      path: "/opt/scraperusa_v2",

      // 🟦 Antes de enviar arquivos (local)
      "pre-deploy-local": "",

      // 🟪 Comandos executados NO VPS após receber o código
      "post-deploy": `
        npm install &&
        npm run build &&
        pm2 reload ecosystem.config.js --only scraperusa_v2
      `,
    },
  },
};
