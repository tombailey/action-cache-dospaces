#!/bin/sh

create_files()
{
  echo "test_file" > ~/test_file.txt
  mkdir --parents ~/test_dir
  touch ~/test_dir/test_dir_file
  cp ~/test_file.txt /app/test_file.txt
  cp -r ~/test_dir /app/test_dir
}

delete_files()
{
  rm ~/test_file.txt
  rm -rf ~/test_dir
  rm /app/test_file.txt
  rm -rf /app/test_dir
}

ensure_files_exist()
{
  ls ~/test_file.txt > /dev/null
  ls ~/test_dir > /dev/null
  ls ~/test_dir/test_dir_file > /dev/null
  ls /app/test_file.txt > /dev/null
  ls /app/test_dir > /dev/null
  ls /app/test_dir/test_dir_file > /dev/null
}

set -e

create_files
npm run test:save
delete_files
npm run test:restore
ensure_files_exist

delete_files
npm run test:move
npm run test:restore
ensure_files_exist

echo "Test successful!"
