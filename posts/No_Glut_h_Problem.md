# No Glut.h Problem #

 使用原生态linux+gcc套件的时候会有许多用IDE的时候遇不到的问题，比如需要为gcc手动指定link目标（否则gcc不知道该往哪里链接就会抛锚）；
 知道这一点的我小心翼翼地指定了：
 `gcc test.c -lGL -lGLU -lglut`
 可喜可贺地遇到了报错："glut.h: No such file or directory"
 于是我改成了 `#include <gl/glut.h>`
 报错稍有变化："gl/glut.h: No such file or directory"
 于是只好Google"linux glut.h no such file"
 结果第一条："You must also be aware that C++ and Ubuntu are both case-sensitive. The correct include line in your program is: #include <GL/glut.h>."
 :blackrockshooterface:
 改成"#include <GL/glut.h>" "gcc test.c -lGL -lGLU -lglut"编译通过

 Knighthana@XDU
 2019/10/17
