const express = require('express')
const { readFileSync, writeFileSync } = require('fs')
const { resolve } = require('path')
const app = express()
const port = 3000
const userFile = resolve('./users.json')

function readAndParse() {
    return JSON.parse(readFileSync(userFile))
}

function writeFile(data) {
    writeFileSync(userFile, JSON.stringify(data, null, 2))
}

app.use(express.json())

// get all users
app.get('/user', (req, res) => {
    return res.status(200).json(readAndParse())
})

// get user/users by name
app.get('/user/getByName', (req, res) => {
    const { name } = req.query
    const users = readAndParse()
    const usersExists = users.filter(user => user.name === name)
    if (usersExists.length === 0)
        return res.status(400).json({ message: 'user name not found' })
    return res.status(200).json(usersExists)
})

// get filters users by minimum age.
app.get('/user/filter', (req, res) => {
    const { minAge } = req.query
    const users = readAndParse()
    const usersExists = users.filter(user => user.age >= minAge)
    if (usersExists.length === 0)
        return res.status(400).json({ message: 'no user found' })
    return res.status(200).json(usersExists)
})

// get user by id
app.get('/user/:id', (req, res) => {
    const { id } = req.params
    const users = readAndParse()
    const user = users.find(user => user.id == id)
    if (!user)
        return res.status(400).json({ message: 'user ID not found' })
    return res.status(200).json({ ...user })
})

// add user
app.post('/user', (req, res) => {
    const { name, age, email } = req.body
    if (!name || !age || !email)
        return res.status(400).json({ message: 'all fields are required' });
    const users = readAndParse()
    if (users.find(user => user.email === email))
        return res.status(409).json({ message: 'user email is already exists' })
    const newUser = {
        id: users.length ? users[users.length - 1].id + 1 : 1,
        name,
        age,
        email
    }
    users.push(newUser)
    writeFile(users)
    return res.status(201).json({ message: 'user added successfully', name, age, email })
})

// update user
app.patch('/user/:id', (req, res) => {
    const { id } = req.params
    const { name, age, email } = req.body
    const users = readAndParse()
    const user = users.find(user => user.id == id)
    if (!user)
        return res.status(400).json({ message: 'user ID not found' })
    if (email && users.find(user => user.email === email))
        return res.status(409).json({ message: 'email already exists' });
    if (email) user.email = email
    if (age) user.age = age
    if (name) user.name = name
    writeFile(users)
    return res.status(200).json({ message: 'user Updated successfully', ...user })
})

// delete user
app.delete('/user{/:id}', (req, res) => {
    let id;
    if (req.params.id) id = req.params.id;
    else id = req.body.id
    const users = readAndParse()
    const useridx = users.findIndex(user => user.id == id)
    if (useridx === -1)
        return res.status(400).json({ message: 'user ID not found' })
    users.splice(useridx, 1)
    writeFile(users)
    return res.status(200).json({ message: 'user Deleted successfully' })
})

app.listen(port, () => {
    console.log(`app is running in port ${port}`)
})