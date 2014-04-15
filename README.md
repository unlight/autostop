#Autostop [![Build Status](https://travis-ci.org/3dev/autostop.png?branch=dev)](https://travis-ci.org/3dev/autostop)

## Ресурсы
* [Текущая версия](http://autostop-dev.herokuapp.com)
* [Continuous Integration сервер](https://travis-ci.org/3dev/autostop)
* [Задачи](https://app.asana.com/0/9761538479759/9761538479763)
* [Мокапы](http://ninjamock.com/s/xeunme)

## Установка
Предварительно необходимо установить:

* [MongoDB](http://docs.mongodb.org/manual/installation/). Убедитесь что база данных запущена на порту 27017.
* [Node.js](http://nodejs.org/download/).
* [Grunt](http://gruntjs.com/).
* [Bower](http://bower.io/) - менеджер web-пакетов для Node.js.

```
$ npm install -g grunt-cli
$ npm install -g bower
```

Клонируйте проект:

```
git clone git@github.com:3dev/autostop.git
```

Перейдите в директорию с проектом и выполните:

```
npm install
```

Запустите приложение:

```
grunt
```

и перейдите в браузере на [http://localhost:3000](http://localhost:3000)
