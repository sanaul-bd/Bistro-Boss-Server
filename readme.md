
# ##########################################################
যা যা দেখতে হবে: Jwt, Axios, axisInterceptor, pagenaation , gsap/react(animation for client job), [useMemo, useCallbak, useRef, useReducer]
1. image server: https://web.programming-hero.com/update-1/video/update-1-79-5-upload-image-to-image-hosting-server-imgbb-and-get-image-url
# ##########################################################

# install server : 
* Server Code link : https://github.com/sanaul-bd/Bistro-Boss-Server
* npm init -y
* npm i express mongodb cors dotenv

<!-- ! ################################################################ -->

Email use for mongoDb -----<>
Name : Bistro Boss Restaurante Server.
Email : DevConfig.bd@gmail.com

cluster Name: Bistro-Boss-Restaurante-Server
user name: devconfigbd.
pass: 8ZfNmq4BKUuaUsNs.

stripe: 
devconfig.bd@gmail.com
pass: Dj6a3z2J5ay8  || Dj6a3z2J5ay8


<!-- ! ################################################################ -->



-----------------------------------------------
<!-- menu -->

{
    "_id":65721607743caf715ad909b1
    "name":"Fish Parmentier"
    "recipe":"Sautéed breaded veal escalope with watercress, lemon and veal jus."
    "image":"https://cristianonew.ukrdevs.com/wp-content/uploads/2016/08/product-8-…"
    "category":"soup"
    "price":9.5
}

<!-- payment  -->
{
    "_id": "65c69c158ccbf1af6dbafcb5",
    "email": "sanaullah.bd21@gmail.com",
    "price": 51.8,
    "Transaction_ID": "pi_3Oi1p8Ep3bUWfzDZ1793nqUq",
    "date": "2024-02-09T21:41:41.476Z",
    "_cartIds": [
        "65c69bf68ccbf1af6dbafcb1",
        "65c69bfd8ccbf1af6dbafcb2",
        "65c69bff8ccbf1af6dbafcb3",
        "65c69c058ccbf1af6dbafcb4"
    ],
    "menuItemIds": [
        "65721607743caf715ad909ad",
        "65721607743caf715ad909c8",
        "65721607743caf715ad909c1",
        "65721607743caf715ad9099d"
    ],
    "status": "pending"
},

----------------------- my generate code
    db.paymentCollection.aggregate([
    { $unwind: "$menuItemIds" }, // Unwind the menuItemIds array
    { 
        $addFields: { 
        "menuItemIds._id": { $convert: { input: "$menuItemIds", to: "objectId" } } 
        } 
    }, // Add _id field with objectId value for each menuItemIds
    { $group: { _id: "$_id", root: { $first: "$$ROOT" } } }, // Group back the documents
    { $replaceRoot: { newRoot: "$root" } } // Replace the root
    ])


    -------------------
    {
            $project: {
              email: 1, // Include any other fields from the payment document that you need
              menuItemIds: {
                $map: {
                  input: "$menuItemIds",
                  as: "itemId",
                  in: { $toObjectId: "$$itemId" },
                },
              },
            },
          },
    --------------------------------------
          const result = await paymentCollection
                .aggregate([
                    {
                        $project: {
                            email: 1, // Include any other fields from the payment document that you need
                            menuItemIds: {
                                $map: {
                                    input: "$menuItemIds",
                                    as: "itemId",
                                    in: { $toObjectId: "$$itemId" },
                                },
                            },
                        },
                    },
                    {
                        $unwind: "$menuItemIds",
                    },
                    {
                        $lookup: {
                            from: "menu",
                            localField: "menuItemIds",
                            foreignField: "_id",
                            as: "orderedItems",
                        },
                    },
                    {
                        $group: {
                            _id: "$_id",
                            email: { $first: "$email" },
                            orders: {
                                $push: "$orderedItems"
                            }
                        },
                    },
                ])
                .toArray();
-----------------------------------------------


# 75-7 Select right tab based on the category
1. install server techonologis. 
2. 
3. 
4. 
5. 



# ----------------------------------------------------------------------
        ----  BASIC SECURITY  ----
    a. do not show the link to them who shouldn't see them. 
    b. only show that person /type of user who should see it. 
    c. if someone type url don't show the page. 

        ----  ADVANCE SECURITY || TO SEND DATA  ----
        a. verify JWT Token (এইটা না করলে বুঝা যাবে না কে ইউজ করতেছে, এডমিন নাকি অন্য কেউ নাকি বট। ইচ্ছেমত ডাটা লোড দিয়ে ঝামেলা করে ফেলতে পারবে )
        b. Admin verify : if it is an admin activits make sure only admin user can post this data. 
        c. 
        d. 

# ----------------------------------------------------------------------



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