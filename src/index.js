const express= require("express")

const {default:mongoose} = require ("mongoose")
const router = require("./routes/route")
const app = express()


app.use(express.json())


mongoose.connect("mongodb+srv://ashi:jhansi284205@myfirstcluster.tfihevu.mongodb.net/tailweb",{ 
   useNewUrlParser: true})
.then( ()=> console.log("mongodb is connected"))
.catch(err => console.log(err))

app.use('/',router)

app.listen(process.env.PORT || 3000, function(){
   console.log('express app running on PORT'+ (process.env.PORT || 3000))
})