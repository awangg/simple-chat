# Simple-Chat
 
 Made with Socket.IO and NodeJS. Framework made with https://socket.io/get-started/chat. Hosted with https://ngrok.com/.

# How to Run

Download MongoDB and Robo3T. Change line 15 in server.js to match the database name you select. You can set an authorization password by inserting a new document and adding the line "phrase: 'password'". The auth password is used for higher level commands.

Run with "node server.js" on the package level and navigate to https://localhost:80 to begin chatting in real time.

# Resources/Dependencies (can also look at package.json)

https://socket.io/get-started/chat
NodeJS
Bootstrap
MongoDB/Mongoose
Express
