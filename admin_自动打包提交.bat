cd /d %~dp0
git pull --progress -v --no-rebase "origin"
echo 拉取完成
::pause

call npm run build
echo 打包完成
::pause

rd /s/q "../../public/admin"
echo 删除完成
::pause

md "../../public/admin"
echo 新建完成
::pause

xcopy /e /y /c /h /r "dist" "../../public/admin"
echo 复制完成
::pause

cd ../../public/admin
call git add .
echo public/admin添加完成
::pause

call git commit -m "提交admin"
echo public/admin提交完成
::pause

git pull --progress -v --no-rebase "origin"
echo 拉取完成
::pause

git push --progress "origin" dev:dev
echo 推送完成
pause