#!/bin/sh
sudo apt-get update
sudo apt-get install -y docker.io 
git clone https://github.com/przemek06/tictactoe.git
cd tictactoe/frontend/tic-tac-toe
sudo docker build -t frontend .
sudo docker run -p 3000:3000 frontend