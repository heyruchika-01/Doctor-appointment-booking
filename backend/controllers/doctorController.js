import doctorModel from "../models/doctorModel.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js"

const changeAvailability = async (req,res) => {
    try {

        const {docId} = req.body

        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId,{available: !docData.available})
        res.json({success:true, message: 'Availability Changed'})
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
        
    }
}

const doctorList = async (req,res)=> {
    try {
       const doctors = await doctorModel
      .find({})
      .select('-password -email');
            
             return res.status(200).json({
      success: true,
      doctors,})
        
    } catch (error) {
       console.error("Error fetching doctor list:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error: " + error.message,
    });
    }
}

//API for doctor login
const loginDoctor = async (req,res) => {
    try {

        const {email, password} = req.body
        const doctor = await doctorModel.findOne({email})

        if(!doctor) {
            return res.json({success:false, message:'Doctor not found'})
        }

         const isMatch = await bcrypt.compare(password, doctor.password);
        

    if (!isMatch) {
      return res.json({ success: false, message: 'Invalid credentials' });
    }

    // Generate JWT if matched
    const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, { expiresIn: "7d" });


    res.json({ success: true, token });

        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message} ) 
    }
}

// API to get doctor appointments for doctor panel

const appointmentsDoctor = async (req, res) => {
try{

 const doctorId = req.doctorId;
  if (!doctorId) {
      return res.json({ success: false, message: "Doctor ID not found in request" });
    }


    const appointments = await appointmentModel.find({ docId: doctorId})
     console.log("Appointments found:", appointments);
    res.json({ success: true, appointments });
}
 catch (error) {
       console.error("Error fetching doctor appointments:", error);
       res.status(500).json({ success: false, message: error.message });
     }
   
}

// API to mark appointment completed for doctor panel
const appointmentComplete = async (req, res) => {
    try {

        // const {docId, appointmentId} = req.body
        const doctorId = req.doctorId;        // from authDoctor middleware
        const { appointmentId } = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId)

         if (!appointmentData) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

        if (appointmentData.docId.trim() === doctorId.trim()) {

            await appointmentModel.findByIdAndUpdate(appointmentId, {isCompleted: true})

           return res.json({success:true, message: 'Appointment marked as completed'})
        } else {
           return res.json({success:false, message: 'Appointment marked failed'})
        }


        
    } catch (error) {
          console.error("Error fetching doctor appointments:", error);
       res.status(500).json({ success: false, message: error.message });
        
    }
}



// API to cancel appointment completed for doctor panel
const appointmentCancel = async (req, res) => {
    try {

       const doctorId = req.doctorId;
       const { appointmentId } = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

        if (appointmentData.docId.trim() === doctorId.trim()) {

            await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled: true})

           return res.json({success:true, message: 'Appointment Cancelled'})
        } else {
           return res.json({success:false, message: 'Cancellation failed'})
        }


        
    } catch (error) {
          console.error("Error fetching doctor appointments:", error);
       res.status(500).json({ success: false, message: error.message });
        
    }
}

//API to get dashboard data for doctor panel
const doctorDashboard = async (req,res) => {
    try {

         const doctorId = req.doctorId; // from authDoctor middleware
         if (!doctorId) {
         return res.status(400).json({ success: false, message: "Doctor ID not found in request" });
    }
        const appointments = await appointmentModel.find({docId: doctorId })

        let earnings = 0

        appointments.map((item)=>{
            if(item.isCompleted || item.payment) {
                earnings += item.amount
            }
        })

        let patients = []

        appointments.map((item)=>{
            if (!patients.includes(item.userId)) {
                patients.push(item.userId)
            }
        })

        const dashData = {
            earnings,
            appointments:appointments.length,
            patients:patients.length,
            latestAppointments:appointments.reverse().slice(0,5)
        }

        res.json({success:true, dashData} )
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message} )

        
    }
}

//API to get doctor profile for doctor panel
const doctorProfile = async (req,res) => {
    try {

        const doctorId = req.doctorId;
         if (!doctorId) {
         return res.status(400).json({ success: false, message: "Doctor ID not found in request" });
    }
       const profileData = await doctorModel.findById(doctorId).select('-password')
       res.json({success:true, profileData} ) 

    } catch (error) {
         console.log(error)
        res.json({success:false,message:error.message} )
        
    }
}

//API to update doctor profile from doctor panel
const updateDoctorProfile = async (req,res) => {
    try {
        const doctorId = req.doctorId;
        const {fees, address, available} = req.body

        await doctorModel.findByIdAndUpdate(doctorId,{fees, address, available})
        res.json({success:true, message: 'Profile Updated'} )
        
    } catch (error) {
         console.log(error)
        res.json({success:false,message:error.message} )
        
    }
}


export {changeAvailability,doctorList,
        loginDoctor,
        appointmentsDoctor,
        appointmentComplete,
        appointmentCancel,
        doctorDashboard,
        doctorProfile,
        updateDoctorProfile}