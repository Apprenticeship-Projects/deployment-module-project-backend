#!/bin/bash
seedersPath=src/db/seeders

echo $npm_config_name
if [ -z "$npm_config_name" ]
    then
        echo "Missing '--name=??' argument"
        exit 1
fi

sequelize seed:generate --seeders-path $seedersPath --name $npm_config_name
cd $seedersPath
for file in *.js; do
    mv -- "$file" "${file%.js}.cts"
    cat "00000000000000-template.cts" > "${file%.js}.cts"
done
