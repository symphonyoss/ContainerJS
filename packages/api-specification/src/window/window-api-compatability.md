## Window Options Compatability Martix

**Symphony**|**Electron**|**OpenFin**|**Browser**|**Notes**
-----|-----|-----|-----|-----
alwaysOnTop|alwaysOnTop|alwaysOnTop|</br>|
backgroundColor|backgroundColor|backgroundColor|</br>|
child|child|child|</br>|
center|center|defaultCentered|</br>|
frame|frame|frame|</br>|
hasShadow|hasShadow|shadow|</br>|
height|height|defaultHeight|</br>|
icon|icon|icon|</br>|Local / url
maxHeight|maxHeight|maxHeight|</br>|
maximizable|maximizable|maximizable|</br>|
maxWidth|maxWidth|maxWidth|</br>|
minHeight|minHeight|minHeight|</br>
minimizable|minimizable|minimizable|</br>|
minWidth|minWidth|minWidth|</br>|
resizable|resizable|resizable|</br>|
show|show|autoShow|</br>|
skipTaskbar|skipTaskbar|showTaskbarIcon|</br>|NOT showTaskbarIcon
transparent|transparent|opacity|</br>|Transparent is true or false. Opacity is between 0-1
width|width|defaultWidth|</br>|
x|x|defaultLeft|</br>|
y|y|defaultTop|</br>|

---

## Method Compatability Matrix

**Symphony**|**Electron**|**OpenFin**|**Browser**|**Notes**
-----|-----|-----|-----|-----
blur|blur|blur|blur|
close|close|close|close|
flashFrame|flashFrame|flash / stopFlashing|</br>|
focus|focus|focus|focus|
getBounds|getBounds|getBounds|</br>|Modified OpenFins return to match Electron
getChildWindows|</br>|</br>|</br>|
getMaximumSize|getMaximumSize|getOptions|</br>|
getMinimumSize|getMinimumSize|getOptions|</br>|
getParentWindow|getParentWindow|getParentWindow|</br>|Modified OpenFins return to null if no parent
getPosition|getPosition|getBounds|</br>|
getSize|getSize|getBounds|</br>|
getTitle|getTitle|getOptions|</br>|
hasShadow|hasShadow|getOptions|</br>|
hide|hide|hide|</br>|
isAlwaysOnTop|isAlwaysOnTop|getOptions|</br>|
isMaximizable|isMaximizable|getOptions|</br>|
isMaximized|isMaximized|getOptions|</br>|
isMinimizable|isMinimizable|getOptions|</br>|
isMinimized|isMinimized|getOptions|</br>|
isResizable|isResizable|getOptions|</br>|
loadURL|loadURL|executeJavaScript|</br>|OpenFin runs `window.location = '${url}`
maximize|maximize|maximize|</br>|
minimize|minimize|minimize|</br>|
reload|reload|executeJavaScript|</br>|OpenFin runs `window.location.reload()`
restore|restore|restore|</br>|
setAlwaysOnTop|setAlwaysOnTop|updateOptions|</br>|
setBounds|setBounds|setBounds|</br>|
setIcon|setIcon|updateOptions|</br>|
setMaximizable|setMaximizable|updateOptions|</br>|
setMaximumSize|setMaximumSize|updateOptions|</br>|
setMinimizable|setMinimizable|updateOptions|</br>|
setMinimumSize|setMinimumSize|updateOptions|</br>|
setPosition|setPosition|moveTo|</br>|
setResizable|setResizable|updateOptions|</br>|
setSize|setSize|resizeTo|</br>|
setSkipTaskbar|setSkipTaskbar|updateOptions|</br>|
show|show|show|</br>|
unmaximize|unmaximize|restore|</br>|

---

## Event Compatability Matrix

**Symphony**|**Electron**|**OpenFin**|**Browser**
-----|-----|-----|-----
auth-requested|auth-requested|auth-requested|
blur|blur|blurred|blur
move|move|bounds-changed|
resize|resize|bounds-changed|
bounds-changing|bounds-changing|bounds-changing|
close-requested|close-requested|close-requested|
close|close|closed|unload
disabled-frame-bounds-changed|disabled-frame-bounds-changed|disabled-frame-bounds-changed|
disabled-frame-bounds-changing|disabled-frame-bounds-changing|disabled-frame-bounds-changing|
embedded|embedded|embedded|
external-process-exited|external-process-exited|external-process-exited|
external-process-started|external-process-started|external-process-started|
focus|focus|focused|focus
frame-disabled|frame-disabled|frame-disabled|
frame-enabled|frame-enabled|frame-enabled|
group-changed|group-changed|group-changed|
hide|hide|hidden|hidden
initialized|initialized|initialized|
maximize|maximize|maximized|
message|message|message|message
minimize|minimize|minimized|
navigation-rejected|navigation-rejected|navigation-rejected|
restore|restore|restored|
show-requested|show-requested|show-requested|
show|show|shown|load
