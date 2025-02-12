require('dotenv').config();
const express = require('express');
const mongoose = require('./config/db');
// const { graphqlHTTP } = require('express-graphql');
const { createHandler } = require('graphql-http/lib/use/express');
const schema = require('./graphql/schema');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// app.use('/graphql', graphqlHTTP({
//   schema,
//   graphiql: true
// }));
app.all('/graphql', createHandler({ schema }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
