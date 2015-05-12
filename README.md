# sf-preprocessing
When I first started devloping on Salesforce, I was bummed that the VisualForce development and Deployment workflow didn't lend itself to the preprocessing and FE Architecting techniques being used these days.

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

