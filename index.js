const express = require('express');
const { resolve } = require('path');
const connectDB = require('./connectDB.js');
const bcrypt = require('bcryptjs')
const User = require('./UserSchema.js')


const app = express();
const port = 3010;

app.use(express.static('static'));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.post('/login', async (req,res) => {
  const {email,password} = req.body;
  if(!email||!password){
    return res.status(400).json({message:"Both email and password are required"});
  }
  try {
    const user = await User.findOne({email});
    if(!user){
      return res.status(400).json({message:"User not found"});
    }
    const Ismatch = await bcrypt.compare(password,user.password)
    if(!Ismatch){
      return res.status(400).json({message:"Incorrect password"});
    }
    return res.status(200).json({message:"Login successful"});
  } catch (error) {
    return res.status(500).json({message:"Server Error"});
  }
  
})

app.listen(port, () => {
  connectDB();
  console.log(`Example app listening at http://localhost:${port}`);
});
