const express = require('express')
const { v4: uuid} = require('uuid')

const { sequelize, User, Post } = require('./src/models')

const app = express()
app.use(express.json())

app.post('/users', async (req, res) => {
  try {
    const user = await User.create(req.body)

    return res.json(user)
  } catch (err) {
    console.log(err)
    return res.status(500).json()
  }
})

app.get('/users', async (req, res) => {
  try {
    const users = await User.findAll()

    return res.json(users)
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 'Something went wrong' })
  }
})

app.get('/users/:id', async (req, res) => {
  const { id } = req.params
  try {
    const user = await User.findOne({
      where: { _id: id },
      include: 'posts',
    })

    return res.json(user)
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 'Something went wrong' })
  }
})

app.post('/users/findByCredentials', async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.findByCredentials(email, password)

    return res.json(user)
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 'Something went wrong' })
  }
})

app.delete('/users/:id', async (req, res) => {
  const { id } = req.params
  try {
    const user = await User.findOne({ where: { _id: id } })

    await user.destroy()

    return res.json({ message: 'User deleted!' })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 'Something went wrong' })
  }
})

app.put('/users/:id', async (req, res) => {
  const { id } = req.params
  const { name, email, password } = req.body
  try {
    const user = await User.findOne({ where: { _id: id } })

    user.name = name ?? user.name
    user.email = email ?? user.email
    user.password = password ?? user.password

    await user.save()
    return res.json(user)
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 'Something went wrong' })
  }
})

app.post('/auth/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByCredentials(email, password)
    const token = await user.generateAuthToken()

    res.header('x-api-key', token).send({token, user})
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 'Something went wrong' })
  }
})

app.post('/auth/signout', async (req, res) => {

  const token = req.headers['x-api-key'];

  User.findByToken(token)
    .then(async (user) => {
      if (!user) {
        res.status(400).send();
        return
      }

      user.token = null;
      console.log(user)
      const newUser = await user.save();
      console.log(newUser);
      res.status(200).send(`Old token: ${token}`);

    })
    .catch((e) => {
      res.status(400).send();
    });

})

const jwtAuth = (req, res, next) => {
  const token = req.header('x-api-key') || req.query.token;

  User.findByToken(token)
    .then((user) => {
      if (!user) {
        return Promise.reject();
      }

      req.user = user;
      req.token = token;

      next();
    })
    .catch(() => {
      res.status(401).send();
    });
};

app.post('/auth/isAuth', jwtAuth, (req, res) => {
  res.status(200).send('Authed')
})

app.post('/posts', async (req, res) => {
  const { userId, body } = req.body
  try {
    const user = await User.findOne({ where: { _id: userId } })

    if(!user){
      res.json(null)
      return
    }

    const post = await Post.create({ body, userId: user.dataValues._id,})

    return res.json(post)
  } catch (err) {
    console.log(err)
    return res.status(500).json()
  }
})

app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.findAll()

    return res.json(posts)
  } catch (err) {
    console.log(err)
    return res.status(500).json()
  }
})

app.listen({ port: 5001 }, async () => {
  console.log('Server up on http://localhost:5001')
  await sequelize.authenticate()
  await sequelize.sync()
  console.log('Database Connected!')
})
