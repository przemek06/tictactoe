#!/bin/sh

sudo apt-get install docker 
git clone https://github.com/przemek06/tictactoe.git
cd tic-tac-toe/frontend/tic-tac-toe
docker build -t frontend .
docker run -p 3000:3000 frontend