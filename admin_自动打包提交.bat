cd /d %~dp0
git pull --progress -v --no-rebase "origin"
echo ��ȡ���
::pause

call npm run build
echo ������
::pause

rd /s/q "../../public/admin"
echo ɾ�����
::pause

md "../../public/admin"
echo �½����
::pause

xcopy /e /y /c /h /r "dist" "../../public/admin"
echo �������
::pause

cd ../../public/admin
call git add .
echo public/admin������
::pause

call git commit -m "�ύadmin"
echo public/admin�ύ���
::pause

git pull --progress -v --no-rebase "origin"
echo ��ȡ���
::pause

git push --progress "origin" dev:dev
echo �������
pause