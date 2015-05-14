# sf-preprocessing
When I first started devloping on Salesforce, I was bummed that the VisualForce development and Deployment workflow didn't lend itself to the preprocessing and automation techniques being used these days. Using what I know about 'Modern' Front End Architecture and what I was learning about VisualForce, along with some of the sweet Grunt Plug-ins out there, I came up with this solution to build and deploy a complete set of processed Front End assets to a Salesforce org.

 ## Overview of my workflow
 My standard 'toolkit' for writing VisualForce consists of:
 1. [Sublime Text 3](http://www.sublimetext.com/) with the [MavensMate](http://mavensmate.com/) Plug-In
 2. [Twitter Bootstrap 3](http://getbootstrap.com/)
 3. [Font Awesome](http://fortawesome.github.io/Font-Awesome/)
 4. [ModernizR](http://modernizr.com/)
 
If you aren't familiar with [MavensMate](http://mavensmate.com/), its worth checking it. It keeps a local copy of your Apex and VisualForce synced with your Salesforce org, allowing you to leverage the power of Sublime Text and the mountains of availble plug-ins.

The default folder structure that Maven's Mate sets up for you upon install lends itself perfectly to running this soulution side-by-side inside a Sublime Text Project with a bit of configuration.


```
project
│   README.md
│   file001.txt    
│
└───folder1
    │   file011.txt
    │   file012.txt
    │
    ├───subfolder1
    │   │   file111.txt
    │   │   file112.txt
    │   │   ...
    │
    └───folder2
    │   file021.txt
    │   file022.txt
```


 ## What the Gruntfile Does
- First we delete the old assets that are about to be overwritten.

- Next we copy any 'non-processed' Bower Components into the directory that will be compressed into the completed Static Resource. When we update Bower components, processing will catch changes to source files and build with the latest juice. There are resources (font files for example) that aren't processed in any way. This is to make sure we always deploy the latest version of these resources.

- Next we Lint the custom JS files... At this point it only lints the Node, Bower, and Grunt config files that run the processing. In the future we can/will lint all custom javascript assets.

- Next we run Compass, which does all of the CSS Processing, concatenation, and minification.

- Next the production CSS file is combed for Modernizr syntax and the custom build is generated.

- Next all of the assets, both processed and static are compressed into the ZIP file and renamed as a '.resource' file.

- Next the meta.xml to match the resource is written.

- Finally, the Resource and the XML file are deployed to Salesforce.


The test runs I have done in the development of this process usually take between 10 and 13 seconds. Not too shabby. 





##Roadmap

##Release History

