Remarks

Any application that adds or removes fonts from the system font table should notify other windows of the change by sending a WM_FONTCHANGE message to all top-level windows in the operating system. The application should send this message by calling the SendMessage function and setting the hwnd parameter to HWND_BROADCAST.

When an application no longer needs a font resource that it loaded by calling the AddFontResource function, it must remove that resource by calling the RemoveFontResource function.

This function installs the font only for the current session. When the system restarts, the font will not be present. To have the font installed even after restarting the system, the font must be listed in the registry.

A font listed in the registry and installed to a location other than the %windir%\fonts\ folder cannot be modified, deleted, or replaced as long as it is loaded in any session. In order to change one of these fonts, it must first be removed by calling RemoveFontResource, removed from the font registry (HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Fonts), and the system restarted. After restarting the system, the font will no longer be loaded and can be changed.

Source:[AddFontResourceA function (wingdi.h)](https://docs.microsoft.com/en-us/windows/win32/api/wingdi/nf-wingdi-addfontresourcea)

-------------------------------------------------------------

**A font listed in the registry and installed to a location other than the %windir%\fonts\ folder cannot be modified, deleted, or replaced as long as it is loaded in any session.**

**other than the %windir%\fonts\ folder** heavy, and ROBUST bond to **cannot be modified, deleted, or replaced**

GOOD JOB, M--I--C--R--O--S--O--F--T--
