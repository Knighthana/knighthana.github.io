<meta name="created" content="2019-11-10">

# Remove Icons of Wine APP

  Wine is a powerful program, but not all the time.
  
  I had installed Tencent QQ in wine before, but it never works.

  So I uninstalled it, but the process didn't work well, wine added the QQ icon in my appfinder, but forgot to remove it.

  I must do this myself.

  It's apparently not enough to only delete the program files folder, but it don't work even I find all the QQ key in wine register.

  Some people says that we shall remove `~/.local/share/applications/wine-*`

  It may works in other circumstances, but not this one.

  The last step before the problem solving is deleting items under the `~/.config/menus/applications-merged/` folder.

  Problem solved.

  Knighthana@XDU

  2019/11/10
