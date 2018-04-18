const env = process.env.NODE_ENV || 'development'

const config = {
  development: {
    host: 'localhost',
    port: 3000,
    qiniu: {
      bucket: 'db-test',
      resBaseUrl: 'http://p79eua3q0.bkt.clouddn.com',
      AK: 'NMgxKF4IAmdaE6RL3Uz8_GrzOlDf7sUk-Lfq2mIM',
      SK: '9imMNIbb5h1ckw51wznK5or3KX8ML4XF5fYQtLmA'
    },
    db: 'mongodb://localhost/movie',
  },
  production: {
    host: '',
    port: 8222,
    qiniu: {
      bucket: 'db-test',
      resBaseUrl: 'http://p79eua3q0.bkt.clouddn.com',
      AK: 'NMgxKF4IAmdaE6RL3Uz8_GrzOlDf7sUk-Lfq2mIM',
      SK: '9imMNIbb5h1ckw51wznK5or3KX8ML4XF5fYQtLmA'
    },
    db: 'mongodb://localhost/movie',
  }
}

module.exports = config[env]