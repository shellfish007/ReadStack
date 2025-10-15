---
title: Database Internals
authors: [Alex Petrov]
startDate: 2024-12-01
finishDate: 2025-02-01
tags: [database]
progress: { pagesRead: 370, totalPages: 370 }
---
This books covers below areas:
- Store Engines
    - DBMS: transaction manager, lock manager, storage stuctures(B-Tree/LSM Tree), buffer manager and recovery manager.
    - Techniques: buffering(in memory buffer), mutablity(append-only, copy-on-write are immutable structures) and ordering(if data records are stored in key order on disk).
- Distributed Systems:
    - Failure Detection: heartbeat, pings and Phi-Accrual Failure Detector
    - Leader Election: Bully algorithm, next-in-line failover, invitation algorithm, ring algorithm
    - Dissemination: gossipl protocols, overlay networks, plumtree or partial views 
    - Anti-Entropy: read repair, digest reads, sloopy quorum, hinted handoff, merkle trees, bitmap version vectors
    - Distributed Transactions: ACID/BASE, Calvin, Spnnaer, Percolator 
    - Consensus: leader election and atomic commit
