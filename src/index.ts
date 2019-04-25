import {createConnection, ObjectID} from "typeorm";
import {Post} from "./entity/Post";
import {Category} from "./entity/Category";
import {ObjectID as MongoObjectID} from 'mongodb'

// connection settings are in the "ormconfig.json" file
createConnection().then(async connection => {

    const category1 = new Category();
    category1.name = "TypeScript";

    const category2 = new Category();
    category2.name = "Programming";

    const post = new Post();
    post.title = "Control flow based type analysis";
    post.text = `TypeScript 2.0 implements a control flow-based type analysis for local variables and parameters.`;
    post.categories = [category1, category2];

    await connection.mongoManager.save(post);
    console.log("Post has been saved: ", post);

    const loadedPosts = await connection.mongoManager.find(Post);
    const postId = loadedPosts[0].id

    const loadedById = await connection.mongoManager.findOne(Post, {
        _id: postId
    } as any) // Shouldn't have to cast this, and it should be `id` not `_id`

    // This returns undefined
    const rawId = postId.toHexString()
    const loadedByRawId = await connection.mongoManager.findOne(Post, {
        _id: rawId
    } as any) // Shouldn't have to cast this.
    console.log('Loaded with raw ID:', !!loadedByRawId)

    // This throws an error: TypeError: typeorm_1.ObjectID is not a constructor
    // const reloaded = await connection.mongoManager.findOne(Post, {
    //     _id: new ObjectID(rawId)
    // } as any) // Shouldn't have to cast this.
    // console.log('Reloaded with ObjectID:', !!reloaded)

    // This returns undefined
    const reloadedByObjectId = await connection.mongoManager.findOne(Post, {
        _id: new MongoObjectID(rawId)
    } as any) // Shouldn't have to cast this.
    console.log('Reloaded with Mongo ObjectID:', !!reloadedByObjectId)

    // This returns undefined
    const willNotload = await connection.mongoManager.findOne(Post, {
        id: postId
    })
    console.log('Loaded with ObjectID from db:', !!willNotload)

    // This returns a type error
    // const typeError = await connection.mongoManager.findOne(Post, {
    //     _id: postId
    // })

    // Let's try editing a post and saving it again
    loadedById.title = 'Hey I edited this'
    const saved = await connection.mongoManager.save(loadedById)
    console.log('Saved post', saved)
    console.log('Do the ids match?', loadedById.id === saved.id ? 'Yes! it is saving properly' : 'No, something really odd is happening')

    console.log("Loaded posts from the database: ", loadedPosts);
    console.log('loaded by id', loadedById)

}).catch(error => console.log("Error: ", error));