const express = require('express')

const server = express()

server.use(express.json())


const projects = []

var requisicoes = 0

function log(req, res, next) {
    console.log(++requisicoes)

    return next()
}

server.use(log)

function checkForProject(req, res, next) {
    const { id } = req.params
    const project = projects.find(proj => proj.id == id)

    if (!project) {
        return res.status(400).json({ message: "Project not found" })
    }

    return next()
}

server.get('/projects', (req, res) => {
    return res.status(200).json(projects)
})

server.post('/projects', (req, res) => {
    const { id, title } = req.body

    projects.push({ id: id, title: title, tasks: []})

    return res.status(201).json(projects)
})

server.post('/projects/:id/tasks', checkForProject, (req, res) => {
    const { id } = req.params
    const { title } = req.body

    const project = projects.find(project => project.id == id)

    project.tasks.push(title)

    return res.status(201).json(projects)
})

server.put('/projects/:id', checkForProject, (req, res) => {
    const { id } = req.params
    const { title } = req.body

    const project = projects.find(project => project.id == id)

    project.title = title

    return res.status(200).json(project)
})

server.delete('/projects/:id', checkForProject, (req, res) => {
    const { id } = req.params

    const index = projects.findIndex(project => project.id == id)

    projects.splice(index, 1)

    return res.status(200).send()
})

server.listen(3000)