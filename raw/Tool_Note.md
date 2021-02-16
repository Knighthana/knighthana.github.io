
Useful tools and arguments
============

- - - - - - - -

## Linux

### `gksudo` ###
used as sudo-in-CLI in GUI, to run a application as an administor.

2018-4-18

### `alien` ###
### `fakeroot alien --target=amd64 package.iX86.rpm` ###
alien is a useful tool to transform rpm packages to deb packages, but if used on amd64, iX86 packages cannot be transform under default settings, give an `--target=amd64` argument is quite good idea. By the way, in `man alien` the `--target=architecture` is described not straight-understand.

2018-4-24

