# scriptLoader
javascript script loader

This is a script loader to automatically load a list of scripts. Scripts are executed in the order provided in all modes except async. The loader also has two public functions, loadText and loadFile, that allow one to insert scripts into the document at any time. The loader accepts a config object to configure options. It also accepts an error callback as well as a loaded callback that will execute upon loading of the script. The loader is in early stages of development but works as is for the most part. Work is being done to ensure cross browser compatibility and performance. Any feedback is welcome and appreciated. I will try to post examples of use as well as an example config object as soon as I get a chance. 
