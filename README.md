# So, Tinder changed their API, so this doesn't work anymore

# Tinder Crawler (From 2015)
Node.js app that uses the private Tinder API to fake authentication, spoof app location, and then crawl/download all profiles in the vicinity. 


[![Maintenance Intended](http://maintained.tech/badge.svg)](http://maintained.tech/)

## Instructions

Get your Facebook ID from Facebook

* Put it into the authentication script before starting the application

Get your Facebook ID

* Visit `https://www.facebook.com/dialog/oauth?client_id=464891386855067&redirect_uri=https://www.facebook.com/connect/login_success.html&scope=basic_info,email,public_profile,user_about_me,user_activities,user_birthday,user_education_history,user_friends,user_interests,user_likes,user_location,user_photos,user_relationship_details&response_type=token`
* Copy the URL immediately after getting to the site
* You will need it when you are prompted by the application

Figure out the coordinates of where you'd like to strike

* Pos/neg decimal coordinates rounded to the nearest integer
* You will need it when you are prompted by the application

## Finding specific position

Stick the data into a triangulation algorithim and you can get the specific location of any user that has been crawled upon.

## Is this legal?

I think so.

## Sample data

Sample data that should be returned are included in this repo.

## Installation

```
npm install
npm start
```

# License

Copyright (c) 2016, Eric Zhao, All Rights Reserved. 
THIS CODE AND INFORMATION ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY 
KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
PARTICULAR PURPOSE.

## Recognition

Thanks to `https://gist.github.com/rtt/10403467` for first figuring out the Tinder API.