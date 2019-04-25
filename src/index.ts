import {createConnection} from "typeorm";
import {Post} from "./entity/Post";
import {Category} from "./entity/Category";

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
    } as any)

    // This returns undefined
    const willNotload = await connection.mongoManager.findOne(Post, {
        id: postId
    })
    console.log('This should not be undefined:', willNotload)

    // This returns a type error
    // const typeError = await connection.mongoManager.findOne(Post, {
    //     _id: postId
    // })

    console.log("Loaded posts from the database: ", loadedPosts);
    console.log('loaded by id', loadedById)

}).catch(error => console.log("Error: ", error));