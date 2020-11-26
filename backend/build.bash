#!/bin/bash

heroku container:push web --app mcuve-tracktion  
heroku container:release web --app mcuve-tracktion 