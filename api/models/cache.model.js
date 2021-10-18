module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
            title: String,
            description: String,
            publicationDate: Date,
        },
        { timestamps: true }
    )

    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject()
        object.id = _id
        return object
    })

    const Cache = mongoose.model("cache", schema)
    return Cache
  }