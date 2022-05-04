<h1 align="center">Discover 👁</h1>
<p>
</p>

> Internal drawing, externally. (very externally, you can even use a different device to draw on the target one)

### Proof of concept

![could not load the poc](/media/poc.gif?raw=true)

# Build

You can build this project on either Windows or Linux.
<br>
The shared library build allows you to use it within your existing projects. An example of how to use it this way is DiscoverSharp inside the bindings folder.

### Prerequisites

- [Rider](https://www.jetbrains.com/rider/) / [Visual Studio](https://visualstudio.microsoft.com/it/downloads/)
- [dotNET 6](https://dotnet.microsoft.com/en-us/download/)
- [Node.js](https://nodejs.org/)

### Compile

- Make sure you have installed NodeJS and dotNET support in the Visual Studio installer.
- Build the solution.

> The output `.dll` will contain everything required for Discover to work.

# System-wide Performance Optimizations

### Disable Nagle's algorithm

In the registry editor, set to `0x1` these two fields: 
* TCPNoDelay
* TcpAckFrequency

Key: `Computer\HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\services\Tcpip\Parameters\Interfaces\{INTERFACE_ID}`

