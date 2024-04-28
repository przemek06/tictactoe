#!/bin/sh 

sudo apt-get install docker 
git clone https://github.com/przemek06/tictactoe.git
cd tic-tac-toe/backend/demo
docker build -t backend .
docker run -p 8080:8080 backend