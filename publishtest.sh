npm run build
if [ $1 ];then
  if [ $1 = "-all" ];then
    scp -r ./dist root@120.27.215.205:/data/wwwroot/default/xinyu/xinyu_back/xinyu-web/
  else
    scp -r ./dist/index.js ./dist/index.css root@120.27.215.205:/data/wwwroot/default/xinyu/xinyu_back/xinyu-web/dist/
  fi
else
  scp -r ./dist/index.js ./dist/index.css root@120.27.215.205:/data/wwwroot/default/xinyu/xinyu_back/xinyu-web/dist/
fi