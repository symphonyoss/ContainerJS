This is an attempt to define an API that tries to unify what we currently have in ContainerJS, [the working group APIs](https://symphonyoss.atlassian.net/wiki/display/WGDWAPI/Proposed+Standard+API+Specifications)
and things that we at Tick42 think are useful based on our experience.

This is an initial version that aims to start a discussion - some parts of it are not fully defined (e.g. window events) and some
upcoming parts are just mentioned in comments (e.g. interop). 

This also contains a [document](./confluence.md) describing how to map the [confluence API](https://symphonyoss.atlassian.net/wiki/display/WGDWAPI/Proposed+Standard+API+Specifications) to the current API.

The starting point when reading the code should be [ssf.ts](./ssf.ts) file that describes the ssf root object as exposed to clients applications.