module.exports = {
  apps: [
    {
      name: "scraperusa",
      script: "dist/scheduler/scheduler.js", // <- caminho correto pós build
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

      ref: "origin/main",
      repo: "git@github.com:QuickLotter/scraperusa.git",

      path: "/opt/scraperusa",

      // --------------------------------------
      // Antes de enviar arquivos
      // --------------------------------------
      "pre-deploy-local": "",

      // --------------------------------------
      // Após copiar código no VPS
      // --------------------------------------
      "post-deploy":
        "npm install && npm run build && pm2 reload ecosystem.config.js --only scraperusa",
    },
  },
};
