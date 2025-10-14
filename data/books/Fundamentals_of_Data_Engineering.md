---
title: Fundamentals of Data Engineering
authors: [Joe Reis]
startDate: 2025-01-01
finishDate:
tags: [data engineering, architecture]
progress: { pagesRead: 10, totalPages: 200 }
---
It would be good to read if you need to deal with really complicated data ingestion problems. This would be an extension to event-driven architecture where the situation gets complicated. It covers below topics:
- Data Generation (logs, database changes, CRUD operations, APIs…)
- Data Storage
    - File storage like SSD, Block storage like EBS, Object storage like S3
    - Important concepts such as indexes, partitioning, and clustering.
- Data Ingestion
    - Key Considerations(Frequency of data, Synchronous vs Asynchronous, Throughput, Scalability, Reliability, Durability, Push Versus Pull Versus Poll)
    - Batch Ingestion considerations(Snapshot, File-Based Export, Data Migration)
    - Message and Stream Ingestion Considerations (Schema Evolution, Late-Arriving Data, Ordering, Replay, TTL, Consumer Pull and Push)
    - Various methods to ingest data (Database Log, Change Data Capture, Webhooks)
- Data Transformation (Data normalization)

