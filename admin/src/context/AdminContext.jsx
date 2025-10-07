/* eslint-disable react-refresh/only-export-components */

import { useState } from "react";
import { createContext } from "react";
import axios from "axios";
import {toast} from "react-toastify";

 export const AdminContext = createContext()

const AdminContextProvider = (props) => {

    // const [aToken,setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken'): '')

    const token = localStorage.getItem('token') || '';
    const [aToken, setAToken] = useState(token);
    const [doctors,setDoctors] = useState([])
    const [appointments, setAppointments] = useState([])
    const [dashData, setDashData] = useState(false)


    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const getAllDoctors = async () => {
        try {
            const { data } = await axios.post(
        `${backendUrl}/api/admin/all-doctors`,
        {},
    
        {
          headers: {
            aToken: aToken,
          },
        }
      );

            if (data.success) {
        setDoctors(data.data); // backend should send { success: true, data: [...] }
        console.log("Doctors fetched:", data.data);
      } else {
        toast.error(data.message || "Failed to fetch doctors");
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
      toast.error(error.response?.data?.message || "Server error");
    }
}

    const changeAvailability = async (docId) => {
        try {
    const { data } = await axios.post(
      `${backendUrl}/api/admin/change-availability`,
      { docId },
      {
        headers: {
          aToken: aToken,
        },
      }
    );

    if (data?.success) {
      toast.success(data.message || "Availability updated");
      getAllDoctors(); // refresh the list
    } else {
      toast.error(data.message || "Failed to change availability");
    }
  } catch (error) {
    console.error("Change Availability Error:", error);
    toast.error(error?.response?.data?.message || "Server Error");
  }
    }

    const getAllAppointments = async () => {
      try {
        const {data} = await axios.get(`${backendUrl}/api/admin/appointments`, {
          headers: {
            aToken: aToken,
          },
        });
        if(data.success) {
          setAppointments(data.data);
          console.log(data.data);
          
        } else{
          toast.error(data.message)
        }
        
      } catch (error) {
        toast.error(error.message)
      }
    }

    const cancelAppointment = async (appointmentId) => {
      try {
        const {data} = await axios.post(`${backendUrl}/api/admin/cancel-appointment`, {appointmentId}, {
          headers: {
            aToken: aToken,
          },
        });
        if(data.success) {
          toast.success(data.message);
          getAllAppointments();
        } else{
          toast.error(data.message)
        }
        
      } catch (error) {
        toast.error(error.message)
      }
    }

    const getDashData = async () => {
      try {
        const {data} = await axios.get(`${backendUrl}/api/admin/dashboard`, {
          headers: {
            aToken: aToken,
          },
        });
        if(data.success) {
          setDashData(data.dashData);
          console.log(data.dashData);
        } else{
          toast.error(data.message)
        }
        
      } catch (error) {
        toast.error(error.message)
      }

    }



    const value = {
        aToken,setAToken,
        backendUrl, doctors,
        getAllDoctors, changeAvailability,
        appointments, setAppointments,
        getAllAppointments,
        cancelAppointment,
        dashData, getDashData
        

    }
    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}
export default AdminContextProvider



