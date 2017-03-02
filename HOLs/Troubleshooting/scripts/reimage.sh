#!/bin/bash

if [ $# -ne 1 ]; then
    echo $0: usage: reimage the.nucs.ip.address
    echo $0: for example:
    echo $0: reimage 192.168.2.32
    exit 1
fi

pushd ~/.ssh
ssh-keygen -f 'known_hosts' -R $1
popd
ssh -o "StrictHostKeyChecking no" -o "UserKnownHostsFile=/dev/null" root@$1 "echo 2 > /media/mmcblk0p1/EFI/boot/BOOTX64.default && shutdown -P 0"