//시스템 환경변수를 사용하기 편하도록 export
export default {
    dbhost : process.env.MYSQL_HOST,
    dbuser : process.env.MYSQL_USER,
    dbpass : process.env.MYSQL_PASSWORD,
    dbname : process.env.MYSQL_DATABASE,
    dbport : process.env.MYSQL_PORT
}