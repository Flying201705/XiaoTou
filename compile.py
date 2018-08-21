import subprocess
import os
import sys
import shutil

PROJECT_PATH = os.path.split(os.path.realpath(sys.argv[0]))[0]
CONFIG_PATH = r'%s\assets\scripts\common\config.js' % (PROJECT_PATH)

def getVerInfo(type,ver):
    if type == '1':
        return '开发版 v%s' % ver
    elif type == '2':
        return '生产测试版 v%s' % ver
    elif type == '3':
        return '生产正式版 v%s' % ver

def getAppId(type):
    if type == '1':
        return 'wx052c1c7a94625f6d'
    elif type == '2' or type == '3':
        return 'wxafbaaa17fada0e47'
        
def getRemoteServer(type, version):
    if type == '1':
        return 'http://qyx18.com:1234/res/fenglp'
    elif type == '2':
        return 'https://cdn-xyx.raink.com.cn/xbsd/test/remote-res_%s/' % version
    elif type == '3':
        return 'https://cdn-xyx.raink.com.cn/xbsd/release/remote-res_%s/' % version

def changeConfigVersion(path, ver):
    try:
        f = open(path,'r+',encoding='utf-8')
        all_lines = f.readlines()
        f.seek(0)
        f.truncate()
        for line in all_lines:
            if line.find('version:') >= 0:
                line = '    version: "%s",\n' % ver
            f.write(line)
        f.close()
    except Exception:
        print('配置文件打开失败')
        input()
        sys.exit(1)


#程序开始
print('编译版本选择：')
print(' [1] 开发版')
print(' [2] 生产测试版')
print(' [3] 生产正式版')
type = input('\n输入序号:')
version = ''

while  (type not in ('1','2','3')):
	type = input('输入序号:')

if type in ('2','3'):
    if type == '2':
        print('\n准备编译“生产测试版”')
    elif type == '3':
        print('\n准备编译“生产正式版”')    
    version = input('输入版本号:')
    
print(getAppId(type))
print(getRemoteServer(type,version))

debugChange = False

shutil.copyfile(CONFIG_PATH,'config.js.tmp')

try:
    f = open(CONFIG_PATH,'r+',encoding='utf-8')
    all_lines = f.readlines()
    f.seek(0)
    f.truncate()
    for line in all_lines:
        #print(line,end='')
        if type == '1':
            if line.find('const DEBUG') >= 0 and line.find('false') >= 0:
                debugChange = True
                line = line.replace('false', 'true')
        elif type == '2' or type == '3':
            if line.find('const DEBUG') >= 0 and line.find('true') >= 0:
                debugChange = True
                line = line.replace('true', 'false')
            elif line.find('version:') >= 0:
                line = '    version: "%s",\n' % version
        f.write(line)
    f.close()
except Exception:
    print('配置文件打开失败')
    input()
    sys.exit(1)

#构建主项目
MAIN_BUILD = "\
title=xiaotou_world;\
platform=wechatgame;\
buildPath=./build;\
inlineSpriteFrames=true;\
wechatgame={\
'appid':'%s',\
'REMOTE_SERVER_ROOT':'%s',\
'orientation':'landscape',\
'subContext':'wx-sub'\
};\
md5Cache=true" % (getAppId(type), getRemoteServer(type,version))
args = 'CocosCreator.exe --path %s --build %s' % (PROJECT_PATH, MAIN_BUILD)
#subprocess.call(args)
os.system(args)

#构建子域项目
SUB_PROJECT_PATH = '%s\\wx-sub' % PROJECT_PATH
SUB_BUILD = "\
title=wx-sub;\
platform=wechatgame;\
buildPath=../build/wechatgame;\
inlineSpriteFrames=true;\
wechatgame={\
'orientation':'landscape',\
'isSubdomain':true\
};\
md5Cache=true"
args = 'CocosCreator.exe --path %s --build %s' % (SUB_PROJECT_PATH, SUB_BUILD)
subprocess.call(args)

#恢复文件
if type=='1' or type=='2':
    shutil.move('config.js.tmp',CONFIG_PATH)
elif type=='3':
    changeConfigVersion('config.js.tmp',version)
    shutil.move('config.js.tmp',CONFIG_PATH)

print('============================================')
print('构建[ %s ]完成 ，按任意键退出' % getVerInfo(type,version))
print('============================================')
input()