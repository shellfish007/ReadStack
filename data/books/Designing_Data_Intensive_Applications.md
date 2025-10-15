---
title: Designing Data Intensive Applications
authors: [Martin Kleppmann]
startDate: 2025-09-01
finishDate: 2025-10-01
tags: [database, scalability]
progress: { pagesRead: 616, totalPages: 616 }
---
This book covers below topics:
- Data Models and Query Languages: Network model, relational model, document database, graph-like data models, column database, in-memory datase
- Storage and Retrival: 
    - LSM Tree: segment, segment compaction, SSTable, MemTable, log
    - B-Tree: Write ahead log(WAL), copy-on-write
    - Indexing: clustered index, multi-column index
- Encoding and Evolution:
    - Compatibility: backward, forward and full compatibility
    - Binary Encoding: Thrift, Protocol Buffer, Avro
- Replication: 
    - Leader follower: single leader, multiple leader, leaderless
    - Syncronous/Asynchronous replication
    - Replication log: statement-based, WAL shipping, row-based, trigger-based
- Partitioning
    - Partitioning Strategy: key range/hash, document/term(secondary index)
    - Rebanlancing Partitions: fixed #partitions, dynamic partitioning, partitioning proportionally to. notes
- Transaction: 
    - single object/multi-objects
    - database-interval vs hetergeneous distributed systems
    - ACID
- Consistency: linearizability, causal consistency, CAP, sequence number ordering, total order broadcast
- Consensus: uniform agreement, integrity, validity and termination
- Distributed Systems Failure Models: failure detection, clocks(physical/logical), byzantine faults
- Batch Processing: Spark, Tez, Flink
- Stream Processing
    - Message broker: traditional vs log-based message brokers
    - Multiple consumers: load balancing vs fan-out
    - CDC with log compaction or event sourcing combined with CQRS
    - Concurrency control in derived data system
    - Use cases: Complex event processing, stream analytics, maintaning materialized view, search on streams.
    - Processing: timestamp, event sceduling, watermarks
    - Fault tolerance: microbatching and checkpoint, atomic commit, idempotence, rebuild state after failure. 
