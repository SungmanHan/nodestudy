// 환경별 DB 설정.
//
// 원래는 config.json 이었지만, 비밀번호가 저장소에 그대로 커밋되는 문제가 있어
// .js 로 바꿔 process.env 에서 읽도록 했습니다. 값은 .env 에 넣으세요 (.env.example 참고).
// JSON 은 값을 계산할 수 없기 때문에 확장자를 바꿔야 했습니다.

const common = {
  dialect: "mysql",
  operatorsAliases: false,
  pool: {
    waitForConnections: true,
    debug: false,
    wait_timeout: 28800,
    connect_timeout: 10,
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

module.exports = {
  development: {
    ...common,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
  },
  test: {
    ...common,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: `${process.env.DB_NAME}_test`,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
  },
  production: {
    ...common,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
  },
};
