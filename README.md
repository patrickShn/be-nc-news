# Northcoders News API

  For instructions, please head over to [L2C NC News](https://l2c.northcoders.com/courses/be/nc-news).

  Project Summary:
    A database of users, comments, topics, and articles,similar to a social media app such as Reddit. the user can execute CRUD operations. 
  
  Link to hosted version (the API is hosted on the free version of Render so it may take a moment to start working):
  https://be-nc-news-famm.onrender.com/api

  
  Getting started:

  start by forking and cloning this repo 

  

  Minimum Versions of Node.js and Postgres needed :
    Node = "20.11.0"
    PostGres = "8.11.3"

  Setup:
  1) npm init -y
  2) npm install
  3) setup database : "npm setup-dbs" 
  4) seed database : "npm run seed"

  dependancies to install:
  1)dotenv
  2)husky
  3)express
  4)pg
  5)supertest
  
  DevDependancies to install:
  1) jest
  2) jest-sorted
  3) pg-format


  Creating .env files
  
  test data:
    
      1) create .env.test file and set PGDATBASE equal to name of test database
    
  development data:
  
    2) create .env.dev file and set PGDATABASE equal to name of development database



  
