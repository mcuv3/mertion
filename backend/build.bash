#!/bin/bash

heroku container:push web --app mcuve-mertion  
heroku container:release web --app mcuve-mertion 