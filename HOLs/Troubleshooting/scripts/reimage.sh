#!/bin/bash

#Verify the IP Address of the remote NUC was passed in as an argument to the script
if [ $# -ne 1 ]; then
    echo $0: usage: reimage the.nucs.ip.address
    echo $0: for example:
    echo $0: reimage 192.168.2.32
    exit 1
fi

# Change into the current user's .ssh folder
pushd ~/.ssh

# Remove the old ssh key for the remote NUC host with the given ip address
ssh-keygen -f 'known_hosts' -R $1

# Change back to the previous working directory
popd

# ssh into the NUC given its IP Address.  
# -o "StrictHostKeyChecking no" -> Don't check for host keys in the known_hosts file 
# -o "UserKnownHostsFile=/dev/null" -> Points to a temporary null known_hosts file to keep the key from being stored
# "echo 2 > /media/mmcblk0p1/EFI/boot/BOOTX64.default" is executed on the NUC, and writes the value "2" to the BOOTX64.default file.  This means that option "2" (the third option, "Reset Factory Image option" on the boot menu) will be used by default.
# "shutdown -P 0" runs on the NUC and powers it down immediately
ssh -o "StrictHostKeyChecking no" -o "UserKnownHostsFile=/dev/null" root@$1 "echo 2 > /media/mmcblk0p1/EFI/boot/BOOTX64.default && shutdown -P 0"