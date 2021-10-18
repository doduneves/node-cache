const db = require("../models")
const Cache = db.caches

const createNewRandomString = (length = 32) => {
    let result = ''
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let charactersLength = characters.length

    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const createNewCache = (key) => {
    const cache = new Cache({
        key: key,
        publicationDate: Date.now()
    })

    cache.save(cache)
    return cache
}

exports.create = (req, res) => {
    if (!req.body.key) {
        res.status(400).send({ message: "Content can not be empty!" })
        return
    }

    const cache = createNewCache(req.body.key, res)
    if (cache){
        res.send(cache)
    }else{
        res.status(500).send({
            message: "Some error while trying to insert a new cache data."
        })
    }

}

exports.findAll = (req, res) => {
    Cache.find()
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving cached data."
            })
        })
}

exports.findOne = (req, res) => {
    const key = req.params.id

    Cache.find({ key: key })
        .then(data => {
            if(!data || data.length == 0){
                console.log("Cache miss")
                const newKey = createNewRandomString()
                const createdCache = createNewCache(newKey)
                res.send(createdCache.key)
            }else{
                console.log("Cache hit!")
                res.send(data)
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving cache with key=" + key
            })
        })
}

exports.delete = (req, res) => {
    const key = req.params.id

    Cache.deleteMany({ key: key })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete cache with id=${id}.`
                })
            } else {
                if (data.deletedCount != 0){
                    res.send({
                        message: `Cache ${key} was deleted successfully!`
                    })
                }else{
                    res.send({
                        message: `Cache ${key} not found!`
                    })
                }
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Cache with id=" + id
            })
        })
}

exports.deleteAll = (req, res) => {
    Cache.deleteMany({})
        .then(data => {
            res.send({
                message: `${data.deletedCount} cache data were deleted successfully!`
            })
        })
        .catch(err => {
            res.status(500).send({
                message:
                err.message || "Some error occurred while removing all caches."
            })
        })
}
