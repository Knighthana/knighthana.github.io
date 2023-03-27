# 计算机系统中常见行为的耗时

（具体时间数据已经过时）

|行为|耗时|
|---|---------|
|L1 cache reference 读取CPU的一级缓存|0.5ns|
|Branch mispredict 转移、分支预测|5ns|
|L2 cache reference 读取CPU的二级缓存|7ns|
|Mutex lock/unlock 互斥锁上锁/解锁|100ns|
|Main memory reference 读取内存数据|100ns|
|Compress 1Ki Bytes with Zippy 1Ki字节压缩|10,000ns|
|Send 2Ki Bytes over 1Gbps network 在1Gbps的网络上发送2Ki字节|20,000ns|
|Read 1MiB sequentially from memory 从内存顺序读取1MiB|250,000ns|
|Round trip within same datacentre 在同一数据中心内往返一次|500,000ns|
|Disk seek 磁盘搜索|10,000,000ns|
|Read 1MiB sequentially from network 从网络上顺序读取1Mi字节的数据|10,000,000ns|
|Read 1MiB sequentially from disk 从磁盘里读取1Mi字节的数据|30,000,000ns|
|Send packet CA->Netherlands->CA 将一个数据包在加利福尼亚与荷兰之间往返一次|150,000,000ns|
