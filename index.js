require('dotenv').config();
const express = require('express');
const mongoose = require('./config/db');
// const { graphqlHTTP } = require('express-graphql');
const { createHandler } = require('graphql-http/lib/use/express');
const schema = require('./graphql/schema');
const cors = require('cors');

const app = express();

const allowedOrigins = [
    'http://localhost:4200',
    'https://101472085-comp3133-assignment2.vercel.app/'
  ];
  
  app.use(cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS not allowed for this origin: ' + origin));
      }
    },
    credentials: true
  }));
  

app.use(express.json());

// app.use('/graphql', graphqlHTTP({
//   schema,
//   graphiql: true
// }));
app.all('/graphql', createHandler({ schema }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
