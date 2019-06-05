# Undefined Reference to Sem and Stdout
-----
## Undefined Reference to Sem\_\*
 Using Linux system process signal C programing Language API sem\_init sem\_post sem\_wait is not defaultly supported by gcc.
 If gcc it directly, there will be a "undefined reference to sem\_\*" error.
 To solve the question, add an argument "-pthread".
------
## Stdout Flush Issue
 I've met a problem that latter code cause segmentation fault before former code stdout showing on screen, in a phrase, error before output.
 The C usually use only one flush buffer, and the buffer only be sent to terminal when there is a "\n", "\r", "EOF", "fflush(stdout)" or ending of the program. So if the printf code don't have a "\n" or something inside, it will wait and never output.
-----
Knighthana @ XDU
2019/06/05
