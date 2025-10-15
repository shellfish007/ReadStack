---
title: Distributed Database
date: 2025-10-13
summary: Talks about confusing concepts in distributed database, such as concurrency, consistency, consensus and isolation.
tags: [database, consistency, replication]
---

Replica ***Consistency*** issues across nodes are often caused by ***replication lag***, though other factors such as non-deterministic operations or replication errors can also contribute. Replication is essential for scalability, availability, and low-latency reads, and is generally implemented using one of three primary architectures: **single-leader**, **Multi-Leader Replication**, or **Leaderless Replication**.

Most production systems use ***asynchronous*** replication, where updates on the primary are propagated to replicas through a ***Replication Log***. The underlying mechanisms vary by database:
- **Statement-based replication**, where SQL statements are replayed on replicas (used in older MySQL versions).
- **Write-Ahead Log (WAL) shipping**, where low-level log records are shipped and applied (used in PostgreSQL).
- **Logical log replication**, where logical changes such as row inserts/updates are sent to replicas.
- **Trigger-based replication**, where database triggers capture and forward changes (less common in modern systems).

Because replicas apply updates asynchronously, they may lag behind the primary, resulting in stale reads. This weakens guarantees like *read-your-own-writes, monotonic reads, and consistent prefix reads*. Consequently, distributed databases define explicit **Consistency** levels, which describe how fresh or ordered data reads are relative to writes. Common consistency levels include *Linearizability, Sequential Consistency, Causal Consistency, read-after-write consistency, monotonic read consistency, and Eventual consistency*. The chosen level depends primarily on the **replication strategy, synchronization mode, and read routing policy**.

**Transaction** group multiple operations into a single atomic unit. ***Transaction Isolation*** level controls how strictly concurrent transactions are isolated from each other. **Within a single database node**, isolation levels define how concurrently executing transactions interact and what intermediate states are visible. Typical isolation levels include *Read Commited, Snapshot Isolation, and Serializable Isolation*. These levels are enforced through ***concurrency*** control mechanisms such as *Multiversion concurrency control (MVCC), Two-Phase Locking, or Optimistic concurrency control (OCC)/Pessimistic concurrency control (PCC)*. Different concurrency control methods express this trade-off differently:
- **Two-Phase Locking (2PL)**:  Higher isolation → more (and longer-held) locks → more blocking.
- **MVCC (Multi-Version Concurrency Control)**:  Higher isolation → longer snapshot lifespan → higher storage overhead and potential write conflicts.
- **Optimistic Concurrency Control**:  Higher isolation → more validation failures → more rollbacks/retries.

When the database is **sharded**, and objects participating in a single transaction are stored on different shards (nodes), maintaining global transactional consistency becomes significantly more complex. In this case, there is no longer a **single transaction log, lock manager, or MVCC snapshot** covering all data partitions. To achieve atomicity and isolation across shards, the system must coordinate using a ***distributed transactions protocol***.

The most common approach is the **Two-Phase Commit**, which ensures that all involved shards either commit or abort together. However, 2PC does not handle coordinator failure by itself, so many modern systems integrate consensus algorithms such as *Paxos, Raft, or Zookeeper Atomic Broadcast* to maintain a consistent commit order by implementing **Total Order Broadcast** in a fault-tolerant way. Systems like Google **Spanner** and CockroachDB go further by combining distributed consensus with global timestamps, enabling serializable isolation and strong consistency across shards and replicas.