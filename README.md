# webplayer

## 项目环境
```
1.安装node环境，下载地址为：https://nodejs.org/en/
2.安装npm
3.编辑器插件下载vue,安装好后重启编辑器。
```

### 项目启动
```
一.three.js和flv.js模块的引入，首先输入命令:
1.npm install three
2.npm install --save flv.js
二.（静态文件放在public目录下），进入 ..\webplayer\src\components\index.vue下使用模块 npm bulid 运行编译项目。
三.编译成功后使用npm serve 启动项目（不能在本地运行，需要搭建http服务器）
```

### 项目服务器搭建（nginx）
```
1.创建目录名（最好与nginx同级目录），例：\webapp\webplayer  将编译好后的依赖dist目录，将其内容copy到webplayer目录下
2.修改nginx.conf配置文件。可参考：

http {
  ...
  ...
	server {
    	listen 8001;
	    root  /usr/local/webapp/webplayer;//项目的路由
	    index index.html;
	}

}
3.访问localhost：自定义端口号  即可

```

### 补充
```
1.flv.js播放器的控制按钮没有添加（例如暂停、全屏等功能），目的是为了与webgl的自动播放做对比，需要后面可以加入。
2.文件加密部分只需要在static部分做整改。
```

