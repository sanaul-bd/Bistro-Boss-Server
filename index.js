const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
// jwt
const jwt = require('jsonwebtoken');

// test secret Api key 
const stripe = require('stripe')(process.env.PAYMENT_SECRET_KEY);

const port = process.env.PORT || 5000;



// middleWare 
app.use(cors());
app.use(express.json());

//* THIS_IS_ALSO_MIDDLEWARE: verifyJWT JWT : next is after verify then jump next function. 
const verifyJWT = (req, res, next) => {
    // if request come with authorization then user is vallied. 
    const authorization = req.headers.authorization;
    // ! if unAuthorize user want access data
    if (!authorization) {
        return res.status(401).send({ error: true, message: "unAuthorized Access---" })
    }
    // token = bearer token;    we'll split gap and get token only 
    const token = authorization.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ error: true, message: "unAuthorized Access (f)" })
        }
        req.decoded = decoded;
        next();
    })
}


// Config 

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const e = require('express');
const uri = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_USER_PASS}@bistro-boss-restaurante.5e9c7hp.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        // Database collection
        const usersCollection = client.db('Bistro_Boss_Restruant').collection('users');
        const menuCollection = client.db('Bistro_Boss_Restruant').collection('menu');
        const reviewsCollection = client.db('Bistro_Boss_Restruant').collection('reviews');
        const cartCollection = client.db('Bistro_Boss_Restruant').collection('carts');

        // ! JWT
        app.post('/jwt', async (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10hr' });
            res.send({ token })
        })

        const verefyAdmin = async (req, res, next) => {
            const email = req.decoded.email;
            const query = { email: email }
            const user = await usersCollection.findOne(query);
            if (user.role !== "admin") {
                res.status(403).send({ error: true, message: "forbidden Access" })
            }
            next();
        }


        // ^ USERS  - Api ----------------------------------
        /*  How can secure user info 
        * 1: jtt token =  verifyToken. 
        * 2. 
        * 3. 
        * 4. 
        */

        // get all users
        // todo verifyJWT was added 
        app.get('/users', verifyJWT, verefyAdmin, async (req, res) => {
            const result = await usersCollection.find().toArray();
            res.send(result);
        })

        // ADMIN Api : AADMIN OR NOT 
        app.get('/users/admin/:email', verifyJWT, async (req, res) => {
            const email = req.params.email;

            // 1st.__jwtVerify, 2nd.__step verify
            if (req.decoded.email !== email) {
                res.send({ admin: false })
            }
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            const result = { admin: user?.role === "admin" };
            res.send(result);
        })

        // pertial update || patch || make someone admin from existing user 
        app.patch('/users/admin/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    role: 'admin'
                },
            };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.send(result)
        })

        // post users profile information
        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log("regular user :: ", user);
            const query = { email: user.email };

            // ! this query  for check user regular or existing. if regular then sign in & post email info on cartCollection || if user existing then return a msg('user allrady existing')
            const existiongUser = await usersCollection.findOne(query);
            console.log("existing User", existiongUser);
            if (existiongUser) {
                return res.send({ message: 'User Allrady exists!!' });
            }

            const result = await usersCollection.insertOne(user);
            res.send(result);
        })


        //* MENU  - Api --------------------------------------------------
        // get
        app.get('/menu', async (req, res) => {
            const result = await menuCollection.find().toArray();
            res.send(result);
        })

        // post new recipe from admin by verify jwt, isAdmin
        app.post('/menu', verifyJWT, verefyAdmin, async (req, res) => {
            const newItem = req.body;
            const result = await menuCollection.insertOne(newItem);
            res.send(result)
        })

        // ! Delete 
        app.delete('/menu/:id', verifyJWT, verefyAdmin, async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await menuCollection.deleteOne(query);
            res.send(result)
        })



        //* REVIEWS  - Api -----------------------------------------------


        //^ Cart  - Api --------------------------------------------------
        app.post('/carts', async (req, res) => {
            const item = req.body;
            console.log(item);
            const result = await cartCollection.insertOne(item);
            res.send(result);
        })

        app.get('/carts', verifyJWT, async (req, res) => {
            const email = req.query.email;

            if (!email) {
                res.send([]);
            }

            // token verefy another step: email verefy
            const decodedEmail = req.decoded.email;
            if (email !== decodedEmail) {
                return res.status(403).send({ error: true, message: "Forbidden Access: 403" })
            }

            const query = { email: email };
            const result = await cartCollection.find(query).toArray();
            res.send(result);
        });

        // 
        app.delete('/carts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await cartCollection.deleteOne(query);
            res.send(result);
        })

        //* Payment apis - server -1
        // আমরা একটি এপিআই বানালাম যেটা দিয়ে আমরা ইউজার কে চ্যালেঞ্জ করে তার বৈধতা দেখে নিবো। তারপর আমরা বডি থেকে প্রাইস / ইনফো নিবো, এমাউন্ট কে পারসফ্লোট করে দিবো যাতে পয়সা হিসেব করা যায়। পেমেন্ট ইন্টেন্ট কল করবো , তাতে অব্জেক্ট দিবো, পেমেন্ট মেথড দিবো আর রেসপন্স দিবো পেমেন্ট ইন্টেন্ট থেকে আসা ক্লাইন্ট সিক্রেট কোড কে। 
        app.post('/create-payment-intent', async (req, res) => {
            // const {item} = req.body;
            const { price } = req.body;
            const amount = parseInt(price * 100);

            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount,
                currency: 'usd',
                payment_method_types: ['card']
            })
            console.log("Client Secret >>> ",paymentIntent.client_secret);
            // console.log("Whole Payment Secret Here::: ",paymentIntent);

            res.send({
                clientSecret: paymentIntent
                // clientSecret: paymentIntent.client_secret
            })
        });



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


// 
app.get('/', (req, res) => {
    res.send("Restaurante Is runninG ");
})

app.listen(port, () => {
    console.log(`Bistro boss "Pinged your deployment. You successfully connected to MongoDB!" PORT == ${port}`);
})

/*
*---------------------------------
*     NAMING CONVENTION
*---------------------------------
* users : usersCollection
* app.get('/users')
* app.get('/users/:id')
* app.post('/users')
* app.patch('/users/:id')
* app.put('/users/:id')
* app.delete('/users/:id')
*/ 