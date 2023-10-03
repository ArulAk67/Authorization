import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import avatar from "../assets/profile.png"

import toast, {Toaster} from 'react-hot-toast';
import {useFormik} from 'formik';
import {profileValidation} from "../helper/validate"
import convertToBase64 from '../helper/convert';

import styles from '../styles/Username.module.css';
import extend from "../styles/Profile.module.css";
import useFetch from '../hooks/fetch.hook';
import { useAuthStore } from '../store/store';
import { updateUser } from '../helper/helper';

function Profile() {

  const [file,setFile] =useState()
  const {username}=useAuthStore(state=>state.auth);
  const [{ isLoading, apiData, serverError }] = useFetch(username);
  const navigate = useNavigate()

  const formik =useFormik({
    initialValues:{
      email:apiData?.email||"",
      fristName:apiData?.fristName||"",
      lastName:apiData?.lastName||"",
      mobile:apiData?.mobile||""
    },
    enableReinitialize: true,
    validate: profileValidation,
    validateOnBlur:false,
    validateOnChange:false,
    onSubmit : async values =>{
      values = await Object.assign(values,{profile: file || apiData?.profile||""})
      console.log(values)

      let updatePromise = updateUser(values);

      toast.promise(updatePromise, {
        loading: 'Updating...',
        success : <b>Update Successfully...!</b>,
        error: <b>Could not Update!</b>
      });

    }
  })

  const onUpload =async e=>{
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  }

  function userLogout(){
    localStorage.removeItem('token');
    navigate('/')
  }

  if(isLoading) return <h1 className='text-2xl font-bold'>isLoading</h1>;
  if(serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>

  return (
    <div className='container mx-auto'>
      
      <Toaster position='top-center' reverseOrder={false}></Toaster>

      <div className='flex justify-center items-center h-screen'>
        <div className={`${styles.glass}` } style={{height:"85%"}}>
          <div className='title flex flex-col items-center'>
             <h4 className='text-5xl font-bold'>Profile</h4>
             <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
                      You can update the details.      </span>
          </div>
          <form className='py-1' onSubmit={formik.handleSubmit}>
            <div className='profile flex justify-center py-4'>
              <label htmlFor='profile'>
               <img src={apiData?.profile ||file || avatar} alt='img' className={`${styles.profile_img} ${extend.profile_img}`}/>   
              </label>
              <input onChange={onUpload} type='file' id='profile' name='profile'/>
            </div>
            <div className='textbox flex flex-col items-center gap-6'>

              <div className='name flex w-3/4 gap-10'>
                <input {...formik.getFieldProps("fristName")} className={`${styles.textbox} ${extend.textbox}`} type='text' placeholder='FristName'/>
                <input {...formik.getFieldProps("lastName")} className={`${styles.textbox} ${extend.textbox}`} type='text' placeholder='LastName'/>
              </div>
              
              <div className='name flex w-3/4 gap-10'>
                <input {...formik.getFieldProps("mobile")} className={`${styles.textbox} ${extend.textbox}`} type='text' placeholder='Mobile no'/>
                <input {...formik.getFieldProps("email")} className={`${styles.textbox} ${extend.textbox}`} type='text' placeholder='Email*'/>
              </div>
              
              <button className={styles.btn} type='submit'>Update </button>
            </div>
            <div className='text-center py-4'>
              <span className='text-gray-500'>come back later? <button onClick={userLogout} className='text-red-500' to="/">Logout</button></span>            
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Profile;