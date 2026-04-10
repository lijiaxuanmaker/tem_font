// 小龙虾 PM2 配置文件
// 用途：管理后端服务
// 使用方法：pm2 start ecosystem.config.js

module.exports = {
  apps: [{
    name: 'tdm-server',
    script: './dist/main.js',
    cwd: '/opt/tdm-app/server',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
    error_file: '/var/log/tdm-server-error.log',
    out_file: '/var/log/tdm-server-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    merge_logs: true,
  }],
};
