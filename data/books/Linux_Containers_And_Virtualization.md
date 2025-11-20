---
title: Linux Containers And Virtualization
authors: [Shashank Mohan Jain]
startDate: 2025-05-01
finishDate: 2025-06-01
tags: [linux, virtualization]
progress: { pagesRead: 156, totalPages: 156 }
---
This books covers below areas:
- Hypervisor
    - Virtual Machine Monitor and device Model
        - Full virtualization vs Paravirtualization
        - CPU, memory, I/O virualization
    - QEMU(a user-space process) and KVM
    - KVM vs VMM: VMM is conceptual component while KVM is the specific Linux kernel module.
- Linux Namespaces: UTS, PID, mount, network, IPC, Cgroup and time namespace
- Cgroup: provides faireness and throttling
- Layered File Systems: file, inode, dentry, superblock