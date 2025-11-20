---
title: Kubernetes: Up and Running
authors: [Brendan Burns, Joe Beda, Kelsey Hightower, Lachlan Evenson]
startDate: 2025-11-01
finishDate: 2025-11-15
tags: [kubernetes]
progress: { pagesRead: 328, totalPages: 328 }
---
This books covers below areas:
- Cluster Architecture
    - Master Node: API server, Scheduler, Controller Manager, etcd
    - Worker Nodes: Kubelet, Kube-proxy, Container Runtime
    - Add-ons: DNS, Dashboard, Monitoring, Logging
- Resources
    - Deployment: 
        - Pod: basic unit, runs containers
        - Replicasets: ensure specified number of pod replicas
        - Deployments: manage stateless applications, rolling updates, rollbacks
        - Daemonsets: run pods on all nodes
        - Statefulsets: manage stateful applications, stable network IDs, persistent storage
        - Jobs and CronJobs: run tasks to completion, scheduled tasks
    - Configuration: 
        - ConfigMaps: store non-confidential configuration data
        - Secrets: store sensitive data
        - Environment Variables: pass configuration to containers
        - Annotations: attach metadata to objects
        - Labels: organize and select subsets of objects
    - Storage: 
        - Volumes: persistent storage for pods
        - PersistentVolumes (PV): cluster-wide storage resources
        - PersistentVolumeClaims (PVC): request storage resources
    - Networking: 
        - Services: expose applications, load balancing
        - Ingress: manage external access to services
        - Gateways: manage traffic into the cluster
    - Security:
        - RBAC: control access to resources
        - Roles and RoleBindings: define permissions
    - Custom Resources:
        - CRDs: extend Kubernetes API with custom resources
        - Controllers: manage custom resources
    - Extensions:
        - Helm: package manager for Kubernetes
        - Operators: manage complex applications