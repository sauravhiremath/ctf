#!/bin/bash

git pull
npm run build
pm2 reload ctf-backend

