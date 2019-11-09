const express = require('express');

const server = express()

server.use(express.json())

const pDb = require('./data/helpers/projectModel')

const aDb = require('./data/helpers/actionModel')

server.get('/api/projects', async (req, res) => {
    try {
        const projects = await pDb.get()
        res.status(200).json({projects})
    } catch(err){
        res.status(500).json({message: 'there was a problem with the server', error: err})
    }
})

server.get('/api/projects/:id', async (req, res) => {
    const id = req.params.id
    try {
        const projects = await pDb.get(id)
        if(projects == null) {
            res.status(404).json({message: 'a project with the specified id does not exist'})
        } else {
            res.status(200).json({projects})
        }
    } catch(err){
        res.status(500).json({message: 'there was a problem with the server', error: err})
    }
})

server.get('/api/projects/:id/actions', async (req, res) => {
    id = req.params.id
    try {
        const projects = await pDb.get(id)
        if(projects == null) {
            res.status(404).json({message: 'a project with the specified id does not exist'})
        } else {
            const actions = await pDb.getProjectActions(id)
            if(actions.length === 0){
                res.status(200).json({message: 'there are no actions for this project. be the first to post one!'})
            } else {
                res.status(200).json(actions)
            }
        }
    } catch(err) {
        res.status(500).json({message: 'there was a problem with the server', error: err})
    }
})

server.post('/api/projects', async (req, res) => {
    const projData = req.body
    if(!projData.name || !projData.description || projData.description === '' || projData.name === '') {
        res.status(400).json({message: 'please provide a name and description for the project.'})
    } else {
        try{
            const project = await pDb.insert({...projData, completed: false})
            res.status(201).json({projData})
        } catch(err){
            res.status(500).json({message: 'there was a problem with the server', error: err})
        }
    }
})

server.put('/api/projects/:id', async (req, res) => {
    const projData = req.body
    const id = req.params.id
    if(!projData.name || !projData.description || projData.description === '' || projData.name === '') {
        res.status(400).json({message: 'please provide a name and description for the project.'})
    } else {
        try{
            const updProj = await pDb.update(id, projData)
            if(updProj == null){
                res.status(404).json({message: 'a project with that id was not found.'})
            }
            res.status(202).json({updProj})
        } catch(err) {
            res.status(500).json({message: 'there was a problem with the server', error: err})
        }
    }
})

server.delete('/api/projects/:id', async (req, res) => {
    const id = req.params.id
    try {
        const project = await pDb.get(id)
        if(!project){
            res.status(404).json({message: 'a project with that id was not found.'})
        } else {
            const delProj = await pDb.remove(id)
            res.status(200).json({delProj})
        }
    } catch(err){
        res.status(500).json({message: 'there was a problem with the server', error: err})
    }
})

server.get('/api/action/:id', async (req, res, next) => {
    const id = req.params.id
    try {
        const action = await aDb.get(id)
        for(let key in action) {
            if(action.hasOwnProperty(key)){
                return res.status(200).json({action})
            } 
        }
        res.status(404).json({message: 'an action with that id does not exist'})
    } catch(err){
        res.status(500).json({message: 'there was a problem with the server', error: err})
    }
})

server.post('/api/projects/:id/actions', async (req, res) => {
    const id = req.params.id
    const action = req.body
    if(!action.notes || !action.description || action.description == '' || action.name == '' ) {
        res.status(400).json({message: 'please provide notes and description for the action.'})
    } else {
        try {
            const actions = await aDb.insert({...action, project_id: id, completed: false})
            res.status(201).json({actions})
        } catch(err) {
            res.status(500).json({message: 'there was a problem with the server', error: err})
        }
    }
})

server.put('/api/projects/actions/:id', async (req, res) => {
    const id = req.params.id
    const updAct = req.body
    if(!updAct.notes || !updAct.description || updAct.notes == '' || updAct.description == '') {
        res.status(400).json({message: 'please provide notes and a description for the action'})
    } else {
        try {
            const action = await aDb.update(id, updAct)
            if(action == null) {
                res.status(404).json({message: 'the action with the specified id does not exist'})
            } else {
                res.status(202).json({action})
            }
        } catch(err) {
            res.status(500).json({message: 'there was a problem with the server', error: err})
        }
    }
})

server.delete('/api/action/:id', async (req, res) => {
    const id = req.params.id
    try {
        const action = await aDb.get(id)
        for(let key in action) {
            if(action.hasOwnProperty(key)){
                const action = await aDb.remove(id)
                res.status(200).json({action})
            } 
        }
        res.status(404).json({message: 'an action with that id does not exist'})
    } catch(err){
        res.status(500).json({message: 'there was a problem with the server', error: err})
    }
})

module.exports = server