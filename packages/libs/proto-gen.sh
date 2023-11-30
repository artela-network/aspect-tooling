#!/bin/sh

camel_to_hyphen() {
    name=$1
    if [ "$name" = "`echo $name | tr A-Z a-z`" ]; then
        echo "${name}"
    else
        name=$(echo "${name}" | sed -r 's/([a-z])([A-Z])/\1-\2/g')
        echo "${name}" | tr '[:upper:]' '[:lower:]'
    fi
}

replace_imports() {
    file=$1
    if [[ "${file}" == *.ts ]]; then
        temp=$(mktemp)
        while IFS= read -r line
        do
            if [[ $line == import* ]]; then
                path=$(echo $line | awk -F'"' '{print $2}')
                IFS='/' read -ra ADDR <<< "$path"
                for i in "${!ADDR[@]}"; do
                    ADDR[i]=$(camel_to_hyphen "${ADDR[i]}")
                done
                newpath=$(IFS=/ ; echo "${ADDR[*]}")
                line=$(echo $line | sed "s|\"$path\"|\"$newpath\"|g")
            fi
            echo "$line" >> "$temp"
        done < "$file"
        mv "$temp" "$file"
    fi
}

process_dir() {
    for entry in "$1"/*; do
        if [ -d "${entry}" ]; then
            process_dir "${entry}"
        elif [ -f "${entry}" ]; then
            replace_imports "${entry}"
        fi
    done

    for entry in "$1"/*; do
        filename=$(basename -- "${entry}")
        dirname=$(dirname -- "${entry}")
        newname=$(camel_to_hyphen "${filename}")
        new_entry="${dirname}/${newname}"
        temp_entry="${dirname}/temp_${newname}"
        if [ "${filename}" != "${newname}" ]; then
            mv -n "${entry}" "${temp_entry}"
            mv -n "${temp_entry}" "${new_entry}"
        fi
    done
}

rm -rf ./proto/aspect ./proto/scheduler ./proto/jitinherent

protoc --plugin=protoc-gen-as=./node_modules/.bin/as-proto-gen --proto_path=../../aspect-core/proto/message --as_out=./proto scheduler/v2/schedule_message.proto
protoc --plugin=protoc-gen-as=./node_modules/.bin/as-proto-gen --proto_path=../../aspect-core/proto/message --as_out=./proto aspect/v2/base_message.proto
protoc --plugin=protoc-gen-as=./node_modules/.bin/as-proto-gen --proto_path=../../aspect-core/proto/message --as_out=./proto aspect/v2/entry_api.proto
protoc --plugin=protoc-gen-as=./node_modules/.bin/as-proto-gen --proto_path=../../aspect-core/proto/message --as_out=./proto aspect/v2/host_api.proto
protoc --plugin=protoc-gen-as=./node_modules/.bin/as-proto-gen --proto_path=../../aspect-core/proto/message --as_out=./proto aspect/v2/cosmos_type.proto
protoc --plugin=protoc-gen-as=./node_modules/.bin/as-proto-gen --proto_path=../../aspect-core/proto/message --as_out=./proto jitinherent/v1/jit_inherent_message.proto

process_dir ./proto/
