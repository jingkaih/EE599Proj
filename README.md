Run

"npm install"

in command line, wait a few seconds until all modules are installed, and then go to path:

"node_modules\google-translate-api"

and open

"index.js"

use "ctrl+f" find "client", change its value from "t" to "gtx", then save.

Do not remove the backend/unzipped_rslt directory!

# Description of the project
This is an online batch translator, it allows user to upload a *.zip* file that includes *.txt* message in foreign languages and a *MAP.JSON* file which specifies the language that understandable to user. Online batch translator will do its job and return a *.zip* file.  
Here is an example of *MAP.JSON*:  
![MAP.JSON](JSON.png)
An example of *.zip*:  
![.zip](demozip.png)  
# Features
#### Reliable Translation
This tool is powered by Google Translate API, which is the number one popular translator in the whole world, supporting over 103 languages and most importantly, free!
#### Batch Processing
User can compress several text files that s/he wants to translate in avoidance of translating them one by one in translate website.
# Overview of implementation
## Front end
>Using NodeJS and  
> * *fs*
> * *path*
> * *express*
> * *multer* 
> * *request*  
* 1. User uploads the *.zip* file from browser
* 2. Front end receives the *.zip* file and stores it in *./public*
* 3. Front end send the request along with *.zip* file to back end
* 4. Receives *result.zip* from back end, send it to user
## Back end
>Using NodeJS and  
> * *fs*
> * *path*
> * *express*
> * *compressing*
> * *zip-local*
> * *google-translate-api*
> * *iconv-lite*  

# link to video
# Screenshots of the demo
# Future work
#### A dropdown menu
A dropdown menu that user can specify which language s/he wants each of the text file to be translated to, hence no more manually configured *MAP.JSON* file are needed.
#### Error notification
If user press the translate button but forgot to upload file in the first place, the browser would notify user.