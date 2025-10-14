---
title: Software Architecture The Hard Parts
authors: [Neal Ford, Mark Richards, Pramod Sadalage, Zhamak Dehghani]
startDate: 2024-08-15
finishDate: 2024-09-30
tags: [system design, software architecture]
progress: { pagesRead: 462, totalPages: 462 }
---
This book is helpful for designing a complex system from stretch and understanding a list of things to take into consideration, where you can find topics on
- Service Granularity: Factors to consider when you want to create one/multiple services
- Data Granularity: Factors to consider when you want to create one/multiple databases, how to decompose monolithic data
- Reuse Patterns: How to reuse your code/services through Code Replication, Shared Library, Shared Service, Sidecars and Service Mesh
- Data Ownership: Should you allow only one/subset/all services to access the database?
- Distributed Data Access: How do different services access data through one of Interservice Communication, Column Schema Replication, Replicated Caching, Data Domain patterns.
- Eventual Consistency Patterns: How does data synchronize through Background Synchronization, Orchestrated Request-Based, Event-Based pattern
- Managing Distributed Workflows: How do different services communicate with each other? Is it orchestrated by a central service? (orchestration/choreography communication)

