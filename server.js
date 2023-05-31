const express = require('express');
const path = require('path');
const http = require('http');
const ip = require('ip');
const cors = require('cors')
const fs = require('fs')
const app = express();

const hostname = '127.0.0.1'; //localhost
const port = 3005; // Change the port number if needed

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'build')));

/* util functions */

//read the user data from json file
const saveUserData = (data) => {
  try {
    const stringifyData = JSON.stringify(data, null, 2)
    fs.writeFileSync('users.json', stringifyData)
  } catch (error) {
    console.log(error.message)
  }
}
//get the user data from json file
const getUserData = () => {
  try {
    const jsonData = fs.readFileSync('users.json')
    return JSON.parse(jsonData)
  } catch (error) {
    console.log(error.message)
  }
}
/* util functions ends */

/* Create - POST method */
app.post('/pogo/user/add', (req, res) => {

  //get the new user data from post request
  const userData = req.body
  //check if the userData fields are missing
  if (userData.id === null || userData.name === null || userData.level === null || userData.score === null || userData.rating === null || userData.message === null || userData.localTimeStamp === null) {
    return res.status(401).send({ error: true, msg: 'User data missing' })
  }

  //get the existing user data
  const existUsers = getUserData()

  if (existUsers) {
    //check if the username exist already
    const findExist = existUsers.find(user => user.id === userData.id)
    if (findExist) {
      return res.status(409).send({ error: true, msg: 'User id already exist' })
    }
    //append the user data
    existUsers.push(userData)

    //save the new user data
    saveUserData(existUsers);
  } else {
    //save the new user data
    saveUserData(userData);
  }

  res.send({ success: true, msg: 'User data added successfully' })
})

/* Read - GET method */
app.get('/pogo/user/list', (req, res) => {
  const users = getUserData()
  res.send(users)
})

/* Update - Patch method */
app.post('/pogo/user/update/:id', (req, res) => {
  //get the username from url
  const id = req.params.id
  //get the update data
  const userData = req.body
  //get the existing user data
  const existUsers = getUserData()
  //check if the username exist or not       
  const findExist = existUsers.find(user => user.id === id)
  if (!findExist) {
    return res.status(409).send({ error: true, msg: 'User id not exist' })
  }
  //filter the userdata
  const updateUser = existUsers.filter(user => user.id !== id)
  //push the updated data
  updateUser.push(userData)
  //finally save it
  saveUserData(updateUser)
  res.send({ success: true, msg: 'User data updated successfully' })
})

/* Delete - Delete method */
app.delete('/pogo/user/delete/:id', (req, res) => {
  const id = req.params.id
  //get the existing userdata
  const existUsers = getUserData()
  //filter the userdata to remove it
  const filterUser = existUsers.filter(user => user.id !== id)
  if (existUsers.length === filterUser.length) {
    return res.status(409).send({ error: true, msg: 'User id does not exist' })
  }
  //save the filtered data
  saveUserData(filterUser)
  res.send({ success: true, msg: 'User removed successfully' })

})


app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// app.listen(port, 'localhost', () => {
//   console.log(`Server is listening on port ${port}`);
// });


server = http.createServer(app);

server.listen(port, hostname);
server.on('listening', function () {
  console.log(`Localhost- http://${server.address().address}:${server.address().port}/ `);
});
