import express from "express"
import fs from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import uniqid from "uniqid"

const blogpostRouter = express.Router() 

console.log("CURRENTS FILE URL: ", import.meta.url)
console.log("CURRENTS FILE PATH: ", fileURLToPath(import.meta.url))
console.log("PARENT FOLDER PATH: ", dirname(fileURLToPath(import.meta.url)))
console.log("TARGET: ", join(dirname(fileURLToPath(import.meta.url)), "blogpost.json"))

const blogpostsJSONPath = join(dirname(fileURLToPath(import.meta.url)), "blogpost.json")

blogpostRouter.post("/", (req, res) => {

  console.log("REQ BODY:", req.body)

  const newUser = { ...req.body, createdAt: new Date(), updatedAt: new Date(), id: uniqid() }

  const blogpostsArray = JSON.parse(fs.readFileSync(blogpostsJSONPath))

  blogpostsArray.push(newUser)


  fs.writeFileSync(blogpostsJSONPath, JSON.stringify(blogpostsArray))

  res.status(201).send({ id: newUser.id })
})

blogpostRouter.get("/", (req, res) => {

  const fileContentAsABuffer = fs.readFileSync(blogpostsJSONPath)
  console.log("file content: ", fileContentAsABuffer)
  const blogpostsArray = JSON.parse(fileContentAsABuffer)
  console.log("file content: ", blogpostsArray)
  res.send(blogpostsArray)
})

blogpostRouter.get("/:blogpostId", (req, res) => {
  const blogpostId = req.params.blogpostId
  console.log("USER ID: ", blogpostId)

  const blogpostsArray = JSON.parse(fs.readFileSync(blogpostsJSONPath))

  const user = blogpostsArray.find(user => user.id === blogpostId)

  res.send(user)
})

blogpostRouter.put("/:blogpostId", (req, res) => {

  const blogpostsArray = JSON.parse(fs.readFileSync(blogpostsJSONPath))

  const index = blogpostsArray.findIndex(user => user.id === req.params.blogpostId)
  const oldUser = blogpostsArray[index]
  const updatedUser = { ...oldUser, ...req.body, updatedAt: new Date() }
  blogpostsArray[index] = updatedUser

  fs.writeFileSync(blogpostsJSONPath, JSON.stringify(blogpostsArray))

  res.send(updatedUser)
})

blogpostRouter.delete("/:blogpostId", (req, res) => {

  const blogpostsArray = JSON.parse(fs.readFileSync(blogpostsJSONPath))

  const remainingUsers = blogpostsArray.filter(user => user.id !== req.params.blogpostId)

  fs.writeFileSync(blogpostsJSONPath, JSON.stringify(remainingUsers))

  res.send()
})

export default blogpostRouter
