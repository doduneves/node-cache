module.exports = app => {
    const caches = require("../controllers/cache.controller.js")

    var router = require("express").Router()

    router.post("/", caches.create)
    router.get("/", caches.findAll)
    router.get("/:id", caches.findOne)
    router.delete("/:id", caches.delete)
    router.delete("/", caches.deleteAll)

    app.use('/api/caches', router)
}