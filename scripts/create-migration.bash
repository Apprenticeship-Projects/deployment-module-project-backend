#!/bin/bash
migrationsPath=src/db/migrations

echo $npm_config_name
if [ -z "$npm_config_name" ]
    then
        echo "Missing '--name=??' argument"
        exit 1
fi

sequelize migration:create --underscored --migrations-path $migrationsPath --name $npm_config_name
cd $migrationsPath
for file in *.js; do
    mv -- "$file" "${file%.js}.cts"
    cat "00000000000000-template.cts" > "${file%.js}.cts"
done
