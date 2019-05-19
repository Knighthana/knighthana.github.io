### Git Cannot Push Caused By Wrong Cloning Method ###

Today I cloned my repo. from github.com, and simply used `git clone git://username/reponame.git` ( BTW: "git://" means "http://" ) .

When I ended my job and tried to push my works to github it said that I can't push.

Warning text : 

> fatal:remote error:
> You can't push to git://github.com/username/reponame.git
> Use https://github.com/username/reponame.git

I don't know what happened at first. My direct sense told me that it maybe related to the remote repo settings.

I search it on the Internet, find that article [解决fatal:remote error:You can't push to git://github.com/username/\*.git问题的办法](https://www.jb51.net/article/98952.htm). It's apparently that I used a wrong method to clone for I have future push plan. So, if I want to clone my own repo from online git repo, I'd better use `git clone git@github.com:username/userrepository.git` but not `git clone git://`

How to fix that?

`git remote rm origin`
`git remote add origin git@github.com:username/reponame.git`

So it has been solved. My work can be continued in new environment.

By the way, there was still some waves before I finally succeed in pushing my local repo to remote repo.

When I tried to use `ssh -t git@github.com`, there was a warning information said :

> @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
> @         WARNING: UNPROTECTED PRIVATE KEY FILE!          @
> @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
> Permissions 0644 for '/home/username/.ssh/id\_rsa' are too open. 

I delightly found that there is such a restriction about id\_rsa file which I never noticed.

I copied my id\_rsa and id\_rsa.pub from another computer with a U size Flash Disk whose fileformat is FAT32 ( maybe NTFS but not \*nix FS for sure ), and the file was copied through my Windows 10 OS's desktop.
The rsa file was copied in my WSL environment at last, but the operation permission set was 777.
I thought that the files' operation permission should defaultly be 644 ( refer to another Gulog "WSL operation permission" ).
Until now, the system gave me a lesson that if an id\_rsa file was set any read or write permission for other users, it won't be trusted.
I changed it's operation permission to 600, and the problem was solved.

And ... don't try to ssh username@github.com. I must be drunk, or I wouldn't have typed that command.

Knighthana @ XDU

2019/05/20
