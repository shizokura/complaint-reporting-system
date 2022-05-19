const MONGOOSE = require('../config/mongo');

module.exports      = class MODEL 
{
    constructor(collection, schema) 
    {
        this.collection_name        = collection;
        this.schema                 = schema;
        this.collection             = MONGOOSE.model(collection, schema, collection);
        this.mongoose               = MONGOOSE;
    }

    getSchema()
    {
        return this.schema;
    }
    async collection()
    {
        return this.collection;
    }
    
    async watcher()
    {
        let changeStream = this.collection.watch();
        return changeStream;
    }
    async paginate({filter, sort, skip, limit})
    {
        const res = await this.collection.find(filter, null, { skip, limit, sort });
        return res ? res : null;
    }
    async batch_by_creation(last_date, filter, limit)
    {
        if(last_date)
        {
            filter.created_at = { '$gt': last_date };
        }

        let sort = { created_at: 1 };
        const res = await this.collection.find(filter).sort(sort).limit(limit);
        return res ? res : null;
    }
    async find(filters = {})
    {
        const collection        = this.collection;
        const res               = await collection.find(filters);

        return res;
    }
    async findOne(filters = {})
    {
        const collection        = this.collection;
        const res               = await collection.findOne(filters);

        return res;
    }
    async doc(id) 
    {
        const collection        = this.collection;
        const res               = await collection.findById(id);
        
        return res;
    }

    async docs(filters = {}) 
    {
        const collection        = this.collection;
        const res               = await collection.find(filters);
        return res;
    }

    async add(options = {}) 
    {
        const collection        = this.collection;
        const modelObj          = new collection(options);
        const modelRes          = await modelObj.save();
        return modelRes;    
    }

    async update(id, update) 
    {
        const collection        = this.collection;
        const modelRes          = await collection.findByIdAndUpdate(id, update, { new: true });
        return modelRes;
    }
    async removeMany(filters = {}) 
    {
        const collection        = this.collection;
        const modelRes          = await collection.deleteMany(filters);
        return modelRes;
    }
    async remove(filters = {}) 
    {
        const collection        = this.collection;
        const modelRes          = await collection.deleteOne(filters);
        return modelRes;
    }
}