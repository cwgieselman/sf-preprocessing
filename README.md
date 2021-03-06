# sf-preprocessing
When I first started devloping on Salesforce, I was bummed that the VisualForce development and Deployment workflow didn't lend itself to the preprocessing and automation techniques being used these days. Using what I know about 'Modern' Front End Architecture and what I was learning about VisualForce, along with some of the sweet Grunt Plug-ins out there, I came up with this solution to build and deploy a complete set of processed Front End assets to a Salesforce org.

## Overview of my workflow
My standard 'toolkit' for writing VisualForce consists of:
 1. [Sublime Text 3](http://www.sublimetext.com/) with the [MavensMate](http://mavensmate.com/) Plug-In
 2. [Twitter Bootstrap 3](http://getbootstrap.com/)
 3. [Font Awesome](http://fortawesome.github.io/Font-Awesome/)
 4. [ModernizR](http://modernizr.com/)
 
If you aren't familiar with [MavensMate](http://mavensmate.com/), its worth checking it. It keeps a local copy of your Apex and VisualForce synced with your Salesforce org, allowing you to leverage the power of Sublime Text and the mountains of availble plug-ins.

The default folder structure that Maven's Mate sets up for you upon install lends itself perfectly to running this soulution side-by-side inside a Sublime Text Project with a bit of configuration. Maven's Mate adds a folder called `workspaces` to your user folder. Inside that folder it adds another folder called `mavensmate`. When you spin up a new project, it adds a folder containing all its assets here. So at this point this is what we have:

```
myuserfolder
│
└───workspaces
    │
    └───mavensmate
        │
        └───vf project1
        │
        └───vf project2
```

I add another folder called `localdev` to `workspaces` and add a folder (with the same name) for each new Maven's Mate project. A clone of this repo goes there. So now we have this:

```
myuserfolder
│
└───workspaces
    │
    └───mavensmate
    │   │
    │   └───vf project1
    │   │
    │   └───vf project2
    │   
    └───localdev
        │
        └───vf project1
        │
        └───vf project2
```

I use a [Sublime TextProject File](http://www.sublimetext.com/docs/3/projects.html) to configure the project so I can work on both the Salesforce files and local asset source files in the same window. See [this gist](https://gist.github.com/cwgieselman/01abfa30fa05bddb3469) for the syntax used.

When you close the project for the first time, Sublime Text will generate a `<projectname>.sublime-workspace` file that stores app-specific info on the same level as the `<projectname>.sublime-project` file. With this in mind and to keep consistent and predictable pathing in the Project file, I store them in a folder called `sublimeProjects` on the same level as the `workspaces` folder. I drop `<projectname>.sublime-project` into a folder for each project (inside `sublimeProjects`) with the same name as the folders that contain the VF pages and Source Code.

```
myuserfolder
└───sublimeProjects
│   │
│   └───vfProject1
│   │   │
│   │   └───vfProject1.sublime-project
│   │   │
│   │   └───vfProject1.sublime-workspace //this file generated by Sublime Text
│   │
│   └───vfProject2
│
└───workspaces
    │
    └───mavensmate
    │   │
    │   └───vfProject1
    │   │
    │   └───vfProject2
    │   
    └───localdev
        │
        └───vfProject1
        │
        └───vfProject2
```

So now when you open the project in Sublime Text the sidebar will display folders and there contained files for you to open, edit, move, whatever you need to do. I find it handy to be able to look at everything all in one window.


## Dependencies
I'm not really inventing anything new here, just combining what I view as a set of useful tools to leverage some newer FE technologies in VisualForce development. Some of the tools used have dependencies not explicitly called out in plain site and will be required to just drop a clone of this repo in a project and go to town... A quick list:
 - [node.js and npm](https://nodejs.org/) is the technology that the process is built on.
 - [Ruby Gems](https://rubygems.org/), [Compass](http://compass-style.org/install/), and [SASS](http://sass-lang.com/install) are all required to run Compass and compile the CSS
 - [Ant](http://ant.apache.org/index.html) is what is used to Deploy to Salesforce.

(I prefer to manage all this dependencies with [Homebrew](http://brew.sh/))

## Grunt & Bower from 10,000 feet
At the heart of this process are [Grunt](http://gruntjs.com/) and [Bower](http://bower.io/). Grunt is what actually runs all the tasks we configure. Bower is what we rely on to make sure all of your Front End librabries (and their dependencies) are up to date.

You can read more about the inner workings of Grunt [here](http://gruntjs.com/getting-started). To get us going:
```
$ npm install -g grunt-cli
```

Same with Bower. [Here](http://bower.io/#getting-started) is a more in-depth read on what is going on. Install with:
```
$ npm install -g bower
```

After you have all your core dependencies installed, the folder structure in place, and this repo cloned we install the plug-ins and Front End Libraries used. (The repo only includes the `package.json` and `bower.json` files Grunt adn Bower use to store metadata.)

Grab the Grunt plug-ins with:
```
$ npm update -g
```

and the Bower Libraries with:
```
$ bower update
```

At this point we have everything in place to do some actual development work. A little bit of configuration and we are ready to make our first deployment.

Open `gruntfile.js` and scroll to Line 176. Here we fill out an array of credentials for the project's Salesforce org. If you are using the folder structure I laied out above, no other configuration is necessary. 


## Using it in a project






## What this actually does



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
- v1.2 - Remove manual copy of Bower assets to output folders and replace with `grunt-bower-copy` (or similar)
- v2.0 - Insert repo into Yeoman Generator to simplify configuration
- v3 - Add `grunt-contrib-requirejs` (or similar)

##Release History
- v1.1 (05/15/2015) - Add `jshint-stylish`, simplify Bower pathing, add `_bootstrap-theme.scss` partial, sort devDependencies and dependencies in `package.json`
- v1.0 (02/27/2015)- Inital upload of project



