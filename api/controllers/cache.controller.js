const db = require("../models")
const Cache = db.caches

exports.create = (req, res) => {
    if (!req.body.title) {
        res.status(400).send({ message: "Content can not be empty!" })
        return
    }

    const cache = new Cache({
        title: req.body.title,
        description: req.body.description,
        // published: req.body.published ? req.body.published : false TODO
    })

    cache
        .save(cache)
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            res.status(500).send({
                message:
                err.message || "Some error occurred while creating the Cache data."
            })
        })
}

exports.findAll = (req, res) => {
    const title = req.query.title
    var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {}

    Cache.find(condition)
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
    const id = req.params.id

    Cache.findById(id)
        .then(data => {
            if (!data)
            res.status(404).send({ message: "Not found cache with id " + id })
            else res.send(data)
        })
        .catch(err => {
            res
            .status(500)
            .send({ message: "Error retrieving cache with id=" + id })
        })
}

exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        })
    }

    const id = req.params.id

    Cache.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
            res.status(404).send({
                message: `Cannot update cache with id=${id}`
            })
            } else res.send({ message: "Cache was updated successfully." })
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating cache with id=" + id
            })
        })
}

exports.delete = (req, res) => {
    const id = req.params.id

    Cache.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
            res.status(404).send({
                message: `Cannot delete cache with id=${id}.`
            })
            } else {
            res.send({
                message: "Cache was deleted successfully!"
            })
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
