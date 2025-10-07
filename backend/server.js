// import express from 'express'
// import cors from 'cors'
// import  'dotenv/config'
// import connectDB from './config/mongodb.js'
// import connectCloudinary from './config/cloudinary.js'
// import adminRouter from './routes/adminRoute.js'
// import userRouter from './routes/userRoute.js'
// // import doctorRouter from './routes/doctorRoute.js'

// //app config
// const app = express()
// const port = process.env.PORT || 4000
// connectDB()
// connectCloudinary()

// //middlewares
// app.use(express.json())
// app.use(cors())

// //api endpoints
// app.use('/api/admin',adminRouter)
// app.use('/api/doctor',doctorRouter)
// app.use('/api/user',userRouter)

// app.get('/',(req,res)=>{
//     res.send('API WORKING ')
// })

// app.listen(port, ()=> console.log("Server Started",port))

import express from 'express'
import cors from 'cors'
import 'dotenv/config'

// ✅ Config imports
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'

// ✅ Route imports
import adminRouter from './routes/adminRoute.js'
import userRouter from './routes/userRoute.js'
import doctorRouter from './routes/DoctorRoute.js'

// ----------------------
// App config
// ----------------------
const app = express()
const PORT = process.env.PORT || 4000

// ----------------------
// Connect Database & Cloudinary
// ----------------------
connectDB()
connectCloudinary()

// ----------------------
// Middlewares
// ----------------------
app.use(express.json())
app.use(cors())

// ----------------------
// Routes
// ----------------------
app.get('/', (req, res) => {
  res.send('✅ API WORKING')
})

app.use('/api/admin', adminRouter)
app.use('/api/doctor', doctorRouter)
app.use('/api/user', userRouter)

// ----------------------
// Error handling middleware
// ----------------------
app.use((err, req, res, next) => {
  console.error('Error:', err.message)
  res.status(500).json({ success: false, message: 'Server Error', error: err.message })
})

// ----------------------
// Start Server
// ----------------------
app.listen(PORT, ()=> console.log("Server Started",PORT))


