#!/bin/sh

echo 'Create DATABASE'
sequelize db:create
echo 'Create Tables'
sequelize db:migrate

exit 0
