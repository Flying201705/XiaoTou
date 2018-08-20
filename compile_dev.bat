set REMOTE_SERVER_ROOT='http://qyx18.com:1234/res/fenglp'
set APPID='wx052c1c7a94625f6d'
set idePath=C:\CocosCreator
set projectPath=C:\Users\bunny\develepment\game\XiaoTou

::修改默认配置
set fn=%projectPath%\assets\scripts\common\config.js
copy %fn% config.js.bak
@echo off
powershell -c "(gc -encoding utf8 %fn%) -replace 'const DEBUG = false', 'const DEBUG = true'" > config.js.tmp
move /y config.js.tmp %fn% 

::构建主项目
%idePath%\CocosCreator.exe ^
--path %projectPath% ^
--build ^
title=xiaotou_world;^
platform=wechatgame;^
buildPath=./build;^
inlineSpriteFrames=true;^
wechatgame={^
'appid':%APPID%,^
'REMOTE_SERVER_ROOT':%REMOTE_SERVER_ROOT%,^
'orientation':'landscape',^
'subContext':'wx-sub'^
};^
md5Cache=true

::构建子域项目
%idePath%\CocosCreator.exe ^
--path %projectPath%\wx-sub ^
--build ^
title=wx-sub;^
platform=wechatgame;^
buildPath=../build/wechatgame;^
inlineSpriteFrames=true;^
wechatgame={^
'orientation':'landscape',^
'isSubdomain':true^
};^
md5Cache=true;^

::恢复原配置文件
move /y config.js.bak %fn% 