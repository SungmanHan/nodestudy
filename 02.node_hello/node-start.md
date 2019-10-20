# Node.js 설치

## 0. git-scm.com 으로 이동하여 다운로드 후 설치
## 1. Nodes.org 이동하여, lts 상용화 버전을 사용
## 2.프로젝트 폴더로 이동하여 프로젝트 폴더 생성
## 3. vscode를 사용하여 폴더열기

## 4. 터미널 창에서
~~~bash
 npm init -y  
~~~

## 5.  Express. 설치
~~~bash
npm I express
~~~

## 6. supervisor.js 글로벌 옵션으로 설치 - **node app**을 매번 실행하는 불편을 덜어주는 모듈(개발 머신에서 한번만 실행)

~~~bash
 npm I -g supervisor  
~~~
## 7. .gitignore를 꼭 생성하자 gitignore.io 에서 자동생성 사용

## 8. Express-generator을 설치 기본 설정된 파일
~~~bash
 npm I -g express-generato  
~~~
### 가. 작업할 폴더가 생성될 폴더로 이동하여 실행(자동으로 폴더를 생성함)
~~~bash
express —view=pug 
~~~
### 나.bin/www 파일을 열고
~~~js
# 기존
server.listen(post);
# 변경
server.listen(post,()=>{console.log(`http://127.0.0.1:${post}`)});
~~~
### 다. 터미널 창에서 아래 명령어로 실행
~~~bash
supervisor bin/ww 
~~~
