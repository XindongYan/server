npm run build-production
if [ $1 ];then
  if [ $1 = "-all" ];then
    scp -r ./dist root@120.27.215.205:/data/wwwroot/default/xinyu/xinyu_back/xinyu-web-prd/
  else
    scp -r ./dist/index.js ./dist/index.css root@120.27.215.205:/data/wwwroot/default/xinyu/xinyu_back/xinyu-web-prd/dist/
  fi
else
  scp -r ./dist/index.js ./dist/index.css root@120.27.215.205:/data/wwwroot/default/xinyu/xinyu_back/xinyu-web-prd/dist/
fi