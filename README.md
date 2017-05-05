# PlinkoMachineLearning

## What you need:
1. Node.js: [https://nodejs.org/en/](https://nodejs.org/en/)
2. Wekinator: [http://wekinator.org/](http://wekinator.org/)
3. PlinkoMachineLearning Folder from this repo.

## After downloading and installing everything:
* Open terminal (Mac) or cmd.exe (Win)
* In terminal/cmd, change directory ```cd``` to /PlinkoMachineLearning  
   Install node package manager ```npm install```  
   after installation run server.js ```node server.js```  
   You should get a message in terminal/cmd that says "It's Alive!"  
* Open the wekinator project _Plinko120inputs5outputs.wekproj_ located in /Weki/Plinko120inputs5outputs  
   Listen to port 8009.  
   Click Run.  
* Open a browser and visit http://localhost:8008
* Click mouse to drop balls.

## Troubleshooting audio problems
* If audio cuts out in the middle of use, restart window ```F5```  
* If audio gets out of hand and won't stop playing  
   Press ```F12``` in your browser to open the console  
   In the console type ```noLoop();``` and press enter  
   Plinko should then pause and mute
   If audio doesn't stop, simply exit your browser
