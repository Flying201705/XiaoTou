projectPath=/Users/bunny/development/game/XiaoTou
APPID='wx052c1c7a94625f6d'
REMOTE_SERVER_ROOT='http://qyx18.com:1234/res/fenglp'

#构建主项目
/Applications/CocosCreator.app/Contents/MacOS/CocosCreator \
--path $projectPath \
--build \
"title=xiaotou_world;\
platform=wechatgame;\
buildPath=./build;\
inlineSpriteFrames=true;\
wechatgame={\
'appid':'$APPID',\
'REMOTE_SERVER_ROOT':'$REMOTE_SERVER_ROOT',\
'orientation':'landscape',\
'subContext':'wx-sub'\
};\
md5Cache=true"

#构建子域项目
/Applications/CocosCreator.app/Contents/MacOS/CocosCreator \
--path $projectPath/wx-sub \
--build \
"title=wx-sub;\
platform=wechatgame;\
buildPath=../build/wechatgame;\
inlineSpriteFrames=true;\
wechatgame={\
'orientation':'landscape',\
'isSubdomain':true\
};\
md5Cache=true;"