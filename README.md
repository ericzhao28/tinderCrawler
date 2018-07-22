## Update
Recent changes to Facebook's 3rd party authorization system means this library works again! Just follow the instructions below.

# Tinder Crawler
Node.js app that uses the private Tinder API to fake authentication, spoof app location, and then crawl/download all profiles in the vicinity. 


[![Maintenance Intended](http://maintained.tech/badge.svg)](http://maintained.tech/)

## Instructions

Get your Facebook ID from Facebook

* Put it into the authentication script before starting the application

Get your Facebook ID

* Visit `https://www.facebook.com/v2.6/dialog/oauth?redirect_uri=fb464891386855067%3A%2F%2Fauthorize%2F&display=touch&state=%7B%22challenge%22%3A%22IUUkEUqIGud332lfu%252BMJhxL4Wlc%253D%22%2C%220_auth_logger_id%22%3A%2230F06532-A1B9-4B10-BB28-B29956C71AB1%22%2C%22com.facebook.sdk_client_state%22%3Atrue%2C%223_method%22%3A%22sfvc_auth%22%7D&scope=user_birthday%2Cuser_photos%2Cuser_education_history%2Cemail%2Cuser_relationship_details%2Cuser_friends%2Cuser_work_history%2Cuser_likes&response_type=token%2Csigned_request&default_audience=friends&return_scopes=true&auth_type=rerequest&client_id=464891386855067&ret=login&sdk=ios&logger_id=30F06532-A1B9-4B10-BB28-B29956C71AB1&ext=1470840777&hash=AeZqkIcf-NEW6vBd`
* View your network requests (on chrome open developer tools and click on the network tab)
* Click the ok button on the Facebook pop-up window.
* In your network request history, there should be a new request called confirm?dpr=1 
* View the body of the response. Copy the text between access_token= and &expires_in=4011.
* You'll need that for authentication

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
