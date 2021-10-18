module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
            key: String,
            content: String,
            timeToLive: Number,
            publicationDate: Date,
        }
    )

    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject()
        object.id = _id
        return object
    })

    const Cache = mongoose.model("cache", schema)
    return Cache
  }