# webplayer

## 项目环境（默认idea编译器）
```
1. 安装node环境，下载地址为：https://nodejs.org/en/
2. 安装npm
3. git clone https://github.com/everraise/webplayer.git
4. 使用idea -> open -> [webplayer project path]
5. 安装vue插件，安装方式：idea -> file -> setting -> plugins 安裝vue
6. 重启 idea 打开[webplayer project path]
```

### 项目启动
```
一.three.js和flv.js模块的引入，首先输入命令:
1.在src/components/目录下terminal:npm install three
2.在src/components/目录下terminal:npm install --save flv.js
二.（静态文件放在public目录下），在src/components/目录下terminal:npm run build。
三.编译成功后在src/components/目录下terminal:npm run serve（不能在本地运行，需要搭建http服务器）
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

