# express-generator setting
~~~bash
 #한번만 설치
 npm i -g express-generator
 #express 프로젝트를 만들 폴더로 이동하여 터미널 창에서 아래와 같이 싷행
 express 06.express-gen view=pug
 #위의 디렉토리로 이동 06.express-gen 아래명령어는 package.json을 참조하여 필요한 라이브러리를 설치
 npm i
~~~

# package에 있는 물결표시
- ~00 의 이하 버전까지 사용 가능
~~~bash
# bin/www : 시작지점
# 각종 middleware 설치
npm i morgan
npm i http-errors
npm i mysql2
npm i rotatting-file-strem
npm i multer
npm i express-session
npm i session-file-store

# 한번만 설치하는 global module
npm i -g sequelize
npm i -g sequelize-cli
npm i -g supervisor
npm i -g pm2 # 모든 노드의 상태를 확인하는 (실패 프로젝트에서 사용)
~~~