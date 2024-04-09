module.exports = {
  apps: [
    {
      name: 'nestjs-getting-started',
      script: 'dist/main.js',
      // The -1 value below means one less than available CPU cores.
      instances: '4',
      node_args: '--max_old_space_size=4096',
      env: {
        PORT: 3000,
        NODE_ENV: 'development',
      },
      env_staging: {
        PORT: 3000,
        NODE_ENV: 'staging',
      },
      env_prod: {
        NODE_ENV: 'prod',
      },
      // interpreter: '',
      // interpreter_args: '--require /path/to/.pnp.js',
      exec_mode: 'cluster',
    },
  ],
};
