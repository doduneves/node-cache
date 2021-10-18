const db = require("../models")
const Cache = db.caches

const cacheLimit = 10

// Generate a random string
const createNewRandomString = (length = 32) => {
    let result = ''
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let charactersLength = characters.length

    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

// Instantiate a Cache Model
const createNewCache = (key, content = '', timeToLive = 1440) => {
    const cache = new Cache({
        key: key,
        content: content,
        timeToLive: timeToLive, // In minutes
        publicationDate: Date.now()
    })

    // Get all cache data to verify if passed the limit
    Cache.find()
        .sort('-publicationDate')
        .then(data => {
            if(data.length > cacheLimit){
                Cache.deleteOne()
                    .sort('publicationDate')
                    .then(lastCache => {
                        console.log("Limit cache data reached out. Last cache deleted")
                    })
            }
        })

    cache.save(cache).then(data =>
        // Get all cache data to verify if passed the limit
        Cache.find()
            .sort('-publicationDate')
            .then(allData => {
                if(allData.length > cacheLimit){
                Cache.deleteOne()
                    .sort('publicationDate')
                    .then(lastCache => {
                        console.log("Limit cache data reached out. Last cache deleted")
                    })
            }
        })
    )
    return cache
}

exports.create = (req, res) => {
    if (!req.body.key) {
        res.status(400).send({ message: "Cache key can not be empty!" })
        return
    }

    const key = req.body.key
    const content = req.body.content

    Cache.find({ key: key })
        .then(data => {
            if(!data || data.length == 0){
                // If cache with key do not exists, create a new one
                const createdCache = createNewCache(key, content)
                res.send(createdCache)
            }else{
                // If exists, update existing cache
                Cache.findOneAndUpdate(
                    { key: key },
                    { publicationDate: new Date(), content: req.body.content, timeToLive: req.body.timeToLive })
                    .then(updatedData => {
                        res.send({
                            message: `Cache ${key} updated`
                        })
                    })
            }
        })
}

exports.findAll = (_, res) => {
    Cache.find()
        .sort('-publicationDate')
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

    Cache.findOne({ key: key })
        .then(data => {
            if(!data || data.length == 0){
                console.log("Cache miss")
                const newKey = createNewRandomString()
                const createdCache = createNewCache(newKey)
                res.send(createdCache.key)

            }else{
                console.log("Cache hit")
                now = new Date()

                if(now > new Date(data.publicationDate.getTime() + data.timeToLive * 60000)){
                    Cache.findOneAndUpdate({ key: key }, { publicationDate: now })
                        .then(updatedData => {
                            res.send(updatedData)
                        })
                }else{
                    res.send(data)
                }
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
