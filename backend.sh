#!/bin/sh 

sudo apt-get update
sudo apt-get install -y docker.io 
git clone https://github.com/przemek06/tictactoe.git
cd tictactoe/backend/demo
sudo docker build -t backend .
sudo docker run -p 8080:8080 backend