


1. unwind for spread element. ছড়িয়ে দিলাম।
2. add fields for - menuCollection এর _id: objectId সাথে মিল করার জন্য এখানে ও menuItemIds এর সাথে সামনে objectId এড করে নিলাম যাতে তুলনা করে নিতে পারি । 
3. Perform the lookup to join with menu collection
4. again unwind for same perpuse
5. grup for: আমরা কি কি নিবো, আর কোথায় নিবো। যেমন এখানে _id: "$collection_Menu_Itms.category" যাচ্ছে কারণ সেখানে এই ২ টা ব্যাপার এ আছে যেটা দিয়ে লিংক করে ডেটা  নেওয়া যাবে। এক দিকে সার্ভারের _id অন্য দিকে সার্ভারের collection.category. 
6. আমরা ডেটা টা যেভাবে ক্লায়েন্টে পাঠাবো। নাম চেঞ্জ হবে কি না সব এখান থেকে । 