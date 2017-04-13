## Window Options Compatability Martix

**Symphony**|**Electron**|**OpenFin**|**Notes**
:-----:|:-----:|:-----:|:-----:
alwaysOnTop|alwaysOnTop|alwaysOnTop|
backgroundColor|backgroundColor|backgroundColor|
child|child|child|
center|center|defaultCentered|
frame|frame|frame|
hasShadow|hasShadow|shadow|
height|height|defaultHeight|
icon|icon|icon|Local / url
maxHeight|maxHeight|maxHeight|
maximizable|maximizable|maximizable|
maxWidth|maxWidth|maxWidth|
minHeight|minHeight|minHeight|
minimizable|minimizable|minimizable|
minWidth|minWidth|minWidth|
resizable|resizable|resizable|
show|show|autoShow|
skipTaskbar|skipTaskbar|showTaskbarIcon|NOT showTaskbarIcon
transparent|transparent|opacity|Transparent is true or false. Opacity is between 0-1
width|width|defaultWidth|
x|x|defaultLeft|
y|y|defaultTop|
<br/>|acceptFirstMouse|<br/>|
<br/>|autoHideMenuBar|<br/>|
<br/>|closeable|<br/>|
<br/>|darkTheme|<br/>|
<br/>|disableAutoHideCursor|<br/>|
<br/>|enableLargerThanScreen|<br/>|
<br/>|focusable|<br/>|
<br/>|fullscreen|<br/>|
<br/>|fullscreenable|<br/>|
<br/>|kiosk|<br/>|
<br/>|modal|<br/>|
<br/>|moveable|<br/>| OpenFin has a dragable option but doesn't seem to effect being moveable
<br/>|parent|<br/>|
<br/>|thickFrame|<br/>|
<br/>|title|<br/>|
<br/>|titleBarStyle|<br/>|
<br/>|type|<br/>|
<br/>|titleBarStyle|<br/>|
<br/>|useContentSize|<br/>|
<br/>|vibrancy|<br/>|
<br/>|zoomToPageWidth|<br/>|
<br/>|<br/>|contextMenu|
<br/>|<br/>|cornerRounding|
<br/>|<br/>|customData|
<br/>|<br/>|hideOnClose|
<br/>|<br/>|resizeRegion|
<br/>|<br/>|saveWindowState|
<br/>|<br/>|taskBarIconGroup|
<br/>|<br/>|state|
<br/>|<br/>|waitForPageLoad|

---

## Method Compatability Matrix

**Symphony**|**Electron**|**OpenFin**|**Notes**
:-----:|:-----:|:-----:|:-----:
blur|blur|blur|
close|close|close|
flashFrame|flashFrame|flash / stopFlashing|
focus|focus|focus|
getBounds|getBounds|getBounds|Modified OpenFins return to match Electron
getChildWindows|<br/>|<br/>|
getMaximumSize|getMaximumSize|getOptions|
getMinimumSize|getMinimumSize|getOptions|
getParentWindow|getParentWindow|getParentWindow|Modified OpenFins return to null if no parent
getPosition|getPosition|getBounds|
getSize|getSize|getBounds|
getTitle|getTitle|getOptions|
hasShadow|hasShadow|getOptions|
hide|hide|hide|
isAlwaysOnTop|isAlwaysOnTop|getOptions|
isMaximizable|isMaximizable|getOptions|
isMaximized|isMaximized|getOptions|
isMinimizable|isMinimizable|getOptions|
isMinimized|isMinimized|getOptions|
isResizable|isResizable|getOptions|
loadURL|loadURL|executeJavaScript|OpenFin runs `window.location = '${url}`
maximize|maximize|maximize|
minimize|minimize|minimize|
reload|reload|executeJavaScript|OpenFin runs `window.location.reload()`
restore|restore|restore|
setAlwaysOnTop|setAlwaysOnTop|updateOptions|
setBounds|setBounds|setBounds|
setIcon|setIcon|updateOptions|
setMaximizable|setMaximizable|updateOptions|
setMaximumSize|setMaximumSize|updateOptions|
setMinimizable|setMinimizable|updateOptions|
setMinimumSize|setMinimumSize|updateOptions|
setPosition|setPosition|moveTo|
setResizable|setResizable|updateOptions|
setSize|setSize|resizeTo|
setSkipTaskbar|setSkipTaskbar|updateOptions|
show|show|show|
unmaximize|unmaximize|restore|
<br/>|blurWebView|<br/>|
<br/>|capturePage|<br/>|
<br/>|center|<br/>|
<br/>|closeFilePreview|<br/>|
<br/>|destroy|<br/>|
<br/>|focusOnWebView|<br/>|
<br/>|getContentBounds|<br/>|
<br/>|getContentSize|<br/>|
<br/>|getNativeWindowHandle|<br/>|
<br/>|getRepresentedFilename|<br/>|
<br/>|hookWindowMessage|<br/>|
<br/>|isClosable|<br/>|
<br/>|isDestroyed|<br/>|
<br/>|isDocumentEdited|<br/>|
<br/>|isFullScreen|<br/>|
<br/>|isFullScreenable|<br/>|
<br/>|isInvisible isShowing?|<br/>|
<br/>|isKiosk|<br/>|
<br/>|isMenuBarAutoHide|<br/>|
<br/>|isMenuBarVisible|<br/>|
<br/>|isMoveable|<br/>|
<br/>|isVisibleOnAllWorkspaces|<br/>|
<br/>|isWindowMessageHooked|<br/>|
<br/>|isfocused|<br/>|
<br/>|previewFile|<br/>|
<br/>|setAppDetails|<br/>|
<br/>|setAspectRatio|<br/>|
<br/>|setAutoHideCursor|<br/>|
<br/>|setAutoHideMenuBar|<br/>|
<br/>|setClosable|<br/>|
<br/>|setContentBounds|<br/>|
<br/>|setContentProtection|<br/>|
<br/>|setContentSize|<br/>|
<br/>|setDocumentEdited|<br/>|
<br/>|setFocusable|<br/>|
<br/>|setFullScreen|<br/>|
<br/>|setFullScreenable|<br/>|
<br/>|setHasShadow|<br/>|cant set shadow via updateOptions in OpenFin
<br/>|setIgnoreMouseEvents|<br/>|
<br/>|setKiosk|<br/>|
<br/>|setMenu|<br/>|
<br/>|setMenuBarVisibility|<br/>|
<br/>|setMoveable|<br/>|
<br/>|setOverlayIcon|<br/>|
<br/>|setParentWindow|<br/>|
<br/>|setProgressBar|<br/>|
<br/>|setRepresentedFilename|<br/>|
<br/>|setSheetOffset|<br/>|
<br/>|setThumbarButtons|<br/>|
<br/>|setThumbnailClip|<br/>|
<br/>|setThumbnailToolTip|<br/>|
<br/>|setTitle|<br/>|cant set title via updateOptions or constructor
<br/>|setVibrancy|<br/>|
<br/>|setVisibleOnAllWorkspaces|<br/>|
<br/>|showDefinitionForSelection|<br/>|
<br/>|showInactive|<br/>|
<br/>|unhookAllWindowMessages|<br/>|
<br/>|unhookWindowMessage|<br/>|
<br/>|<br/>|animate|
<br/>|<br/>|authenticate|
<br/>|<br/>|bringToFront|
<br/>|<br/>|disableFrame|
<br/>|<br/>|enableFrame|
<br/>|<br/>|executeJavascript|
<br/>|<br/>|getGroup|
<br/>|<br/>|getInfo|
<br/>|<br/>|getOptions|
<br/>|<br/>|getState|
