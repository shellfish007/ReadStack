---
title: CQRS
date: 2025-10-14
summary: Explains an example of the Command Query Responsibility Segregation pattern and its practical challenges.
tags: [CQRS, database, event streaming]
---
An example of the **CQRS (Command Query Responsibility Segregation)** pattern is a system that maintains two distinct data stores:
- a primary (write) database, which serves as the *system of record*, and
- a read database, which functions as a *derived data store*.
The read database maintains **materialized views** of complex queries derived from the primary database. It is optimized for *high-throughput, low-latency* read operations, while the primary database focuses on maintaining transactional integrity and supporting consistent writes.
All write operations (commands) are directed to the primary database, whereas read operations (queries) are served from the read database. To keep the two data stores synchronized, **event streaming** mechanisms—commonly implemented with tools such as *Apache Kafka*—are used to propagate changes from the primary database to the read database. This ensures the read side remains *eventually consistent* with the authoritative source of truth on the write side.

## Practical Challenges
In practice, several challenges can arise. Much like the *replication lag* problem in traditional database replicas, the derived data system can suffer from event processing lag, resulting in temporary inconsistencies.
A notable issue is the *time-travel* problem, where out-of-order event delivery (for example, due to network lag or message reordering across Kafka partitions) causes older events to overwrite the effects of newer ones. To mitigate this, it is often desirable to partition both the event log and the derived state using the same partitioning key, ensuring *monotonic reads and stronger consistency* guarantees within each partition.
Despite these safeguards, data drift between the primary and derived systems may still occur. When this happens, several remediation strategies are available:
- **Full rebuild (“big bang replay”)** — Reapply all events from the beginning to rebuild the derived state from scratch.
- **Partial replay** — Start from a known good snapshot of the derived state and reapply only subsequent events.
- **Direct reconciliation** — Compare and repair derived data using authoritative information from the primary database.
Each approach involves trade-offs in recovery time, system availability, and operational cost. The optimal strategy depends on factors such as system size, event ordering guarantees, and tolerance for temporary inconsistency.

## Why Not Store the Views Directly in the Primary Database?
Using a separate read database instead of storing views directly in the primary database offers several benefits:
- *Different optimization goals* — The primary and read databases can use different storage technologies tailored to their access patterns. For example, some databases are optimized for write-heavy workloads, while others are better suited for read-heavy workloads.
- *Asynchronous updates* — In a single-database design, materialized views are typically updated synchronously with each write, increasing write latency. In contrast, CQRS systems update read models asynchronously via event streams, decoupling write performance from read-side complexity.

## Handling Read Database Load
It is true that the read database may still experience heavy load while serving queries and processing update events. However, this can often be mitigated through careful schema design and query optimization.
For instance, if the primary database uses a normalized schema to efficiently handle transactional writes, the read database can maintain a *denormalized* schema optimized for query performance.
This way:
- The primary database remains optimized for *transactional integrity and simple lookups*.
- The read database can serve *complex, high-volume* analytical or aggregation queries with minimal overhead.
In such a setup, the read database only needs to write each event once, rather than updating multiple tables in a transaction as the primary database might. This separation allows both systems to operate efficiently within their respective workloads.


