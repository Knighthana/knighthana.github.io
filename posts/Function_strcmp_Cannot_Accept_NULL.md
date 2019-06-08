#function strcmp cannot accept NULL

 In project fakeshell, I found that if strcmp(NULL, [something]), there will be a segmentation fault.
 It's a problem should be noticed.
 There is a saying that many big companies will make a checkfunction before using str* functions.
 But C make no-check just for efficiency, I think I can make a check if necessary, but not every time.

 Knighthana@XDU
 2019/06/08

