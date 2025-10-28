---
title: Distributed Database
date: 2025-10-13
summary: Talks about confusing concepts in distributed database, such as concurrency, consistency, consensus and isolation.
tags: [database, consistency, replication]
---
Replica **consistency** issues across nodes are most often caused by *replication lag*, though other factors—such as non-deterministic operations, replication errors, or network partitions—can also contribute. Replication is fundamental to achieving scalability, availability, and low-latency reads, and is typically implemented using one of three main architectures: *single-leader, multi-leader, or leaderless replication*.
In practice, single-leader architectures typically employ *(semi-)synchronous* replication to ensure strong consistency guarantees, multi-leader architectures rely on *asynchronous replication* to eliminate cross-leader coordination latency, and leaderless architectures adopt partially asynchronous replication schemes, commonly using *quorum-based writes* with eventual convergence semantics.
Most production systems rely on asynchronous replication, where updates on the primary node are propagated to replicas through a replication log. The underlying mechanisms vary by database:
- *Statement-based replication* — SQL statements are replayed on replicas (used in older MySQL versions).
- *Write-Ahead Log (WAL) shipping* — low-level log records are shipped and applied (used in PostgreSQL).
- *Logical replication* — logical changes such as row inserts and updates are transmitted to replicas.
- *Trigger-based replication* — database triggers capture and forward changes (rare in modern systems).

Because replicas apply updates asynchronously, they may lag behind the primary, resulting in stale reads. This weakens guarantees such as *read-your-own-writes, monotonic reads, and consistent prefix reads*. To manage this, distributed databases define explicit consistency levels, which describe how fresh or ordered data reads are relative to writes. Common levels include *linearizability, sequential consistency, causal consistency, read-after-write consistency, monotonic read consistency, and eventual consistency*. The chosen level depends primarily on the replication model, synchronization mode, and read routing strategy.
*Note on Terminology*:
The term *consistency* is notoriously overloaded across database theory and systems:
- In replication, it refers to the agreement (or divergence) between replicas—this is the context of replica consistency or eventual consistency in asynchronously replicated systems.
- In the CAP Theorem, consistency specifically means linearizability—the guarantee that all operations appear to occur atomically in a single global order.
- In the ACID model, consistency denotes an application-specific invariant, ensuring the database transitions only between valid states as defined by business logic.
In this post, the term “consistency” will refer specifically to replica consistency.

## Transactions and Isolation
A **transaction** groups multiple operations into a single atomic unit. The **isolation level** determines how strictly **concurrent** transactions are isolated from one another. Within a single database node, isolation levels define what intermediate states are visible to concurrently executing transactions. Typical isolation levels include *Read Committed, Repeatable Read (or Snapshot Isolation), and Serializable*. These are enforced through concurrency control mechanisms such as:
- *Two-Phase Locking (2PL):* Higher isolation → more (and longer-held) locks → increased blocking.
- *Multi-Version Concurrency Control (MVCC):* Higher isolation → longer snapshot lifespan → greater storage overhead and potential write conflicts.
- *Optimistic Concurrency Control (OCC):* Higher isolation → more validation failures → increased rollbacks/retries.

## Distributed Transactions
When a database is *sharded*, and data involved in a single transaction resides on different shards (or nodes), maintaining **global transactional consistency** becomes significantly more complex. In this case, there is no single transaction log, lock manager, or MVCC snapshot spanning all partitions. To achieve atomicity and isolation across shards, the system must coordinate using a **distributed transaction protocol**.
The most common approach is the *Two-Phase Commit (2PC) protocol*, which ensures that all participating shards either commit or abort together. However, 2PC alone does not handle coordinator failures. Modern systems therefore integrate **consensus** algorithms such as *Paxos, Raft, or ZAB* to provide fault-tolerant **total order broadcast**, ensuring consistent commit ordering even under failures.
Systems like Google Spanner and CockroachDB extend this model further by combining distributed consensus with *global timestamps*, achieving serializable isolation and strong consistency across both shards and replicas.