// 환경별 DB 설정.
//
// express-generator + sequelize-cli 조합은 원래 config/config.json 을 씁니다.
// 하지만 JSON 에는 비밀번호를 그대로 적어야 해서 저장소에 유출됩니다.
// 그래서 .js 로 두고 process.env 에서 읽습니다. 값은 .env 에 넣으세요 (.env.example 참고).

const common = {
  dialect: "mysql",
  pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
};

const fromEnv = (database) => ({
  ...common,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
});

module.exports = {
  development: fromEnv(process.env.DB_NAME),
  test: fromEnv(`${process.env.DB_NAME}_test`),
  production: fromEnv(process.env.DB_NAME),
};
