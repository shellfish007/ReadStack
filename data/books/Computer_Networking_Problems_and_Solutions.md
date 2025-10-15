---
title: Computer Networking Problems and Solutions
authors: [Russ White, Ethan Banks]
startDate: 2025-04-01
finishDate: 2025-07-01
tags: [computer networking]
progress: { pagesRead: 832, totalPages: 832 }
---
This books covers below areas:
- Data Plane
    - Data Plane Fundamental Concepts: circuit/packet/label switching
    - Data Transport Problems and Solutions: Error Detection and Correction, Multiplexing, Multicast, Anycast, Flow Control
    - Modeling Network Transport: TCP-IP Model, OSI Model, Recursive Internet Architecture (RINA) Model
    - Lower Layer Transports: Ethernet, WIFI
    - Higher Layer Data Transports: IP, TCP, QUIC, ICMP
    - Interlayer Discovery
        - Using well-known and/or manually configured identifiers e.g. TCP ports
        - Storing the information in a mapping database that services can access to map between different kinds of identifiers e.g. DNS(name -> IP), DHCP(assign IPV4)
        - Advertising a mapping between two identifiers in a protocol e.g. ARP(IPV4 -> MAC),  Neighbor Discovery (IPV6 -> MAC)
        - Calculating one kind of identifier from anothers e.g. IS-IS, IPV6 Stateless Ad
    - Quality of Service: 
        - Congestion management: Low-Latency Queueing(timeliness), Class-Based Weighted Fair Queueing(faireness)
        - Queue Management: Managing a Full Buffer(Weighted Random Early Detection), Managing Buffer Delay(Bufferbloat, and CoDel)
    - Network Virtualization: tunnel, overlay
- Control Plane
    - Topology Discovery: which considers how a control plane discovers the network topology and reachability information, contains learning about the topology, learning about reachable destinations, advertising reachability and topology and redistribution between control planes
    - Unicast Loop-Free Paths: which consider the problem of calculating a set of loop-free paths through the network, and the widely deployed solutions to this set of problems. Algorithms include Bellman-Ford Loop-Free Path Calculation, Garcia’s Diffusing Update Algorithm,Dijkstra’s Shortest Path First, Path Vector, Disjoint Path Algorithms
    - Reacting to Topology Changes: which considers the options a control plane has to react to a change in the network topology by detecting topology changes, change distribution, computing a new loop-free path to the destination and installing the new forwarding information into the relevant local tables.
    - Protocols: Policy in the Control Plane, which considers what problems policy needs to solve in the control plane, and a range of solutions for those problems
        - Distributed Control Planes: Distance Vector, Link State and Path Vector
        - Centralized Control Planes: SDN
    - Policy in the Control Plane: considers what problems policy needs to solve in the control plane, and a range of solutions for those problems
        - Routing and Potatoes: hot/cold potato routing
        - Resource Segmentation: VLANs, subnetting, ACLs, Virtual routing and forwarding, MPLS VPNs, SDN/NFV
        - Flow Pinning: Policy-Based Routing, MPLS Traffic Engineering, SDN Controllers, Link Aggregation Hashing
    - Failure Domains and Information Hiding: which considers route filtering, aggregation, summarization, and other forms of routing protocol policy
- Network Design: common topologies such as ring, mesh, hub-and-spoke