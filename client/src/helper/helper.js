import axios from 'axios';
import jwt_decode from 'jwt-decode';

axios.defaults.baseURL = "https://mern-backend-6mj8.onrender.com/user";


export async function getUsername(){
    const token = localStorage.getItem('token')
    if(!token) return Promise.reject("Cannot find Token");
    let decode = jwt_decode(token)
    return decode;
}

export async function authenticate(username){
    try {
        return await axios.post('/authenticate', { username:username})
    } catch (error) {
        return { error : "Username doesn't exist...!"}
    }
}

export async function getUser(username ){
    try {
        const res = await axios.get(`/${username}`).catch((err)=>console.log(err));
        // const data=JSON.stringify(res.data, null, 2);
        const data= res.data;
        return { data};
    } catch (error) {
        return { error : "Password doesn't Match...!"}
    }
}



export async function registerUser(credentials){
    try {
        const { data,status} = await axios.post(`/register`, credentials);

        let { username, email } = credentials;

        const msg="User Register Successfully"
   
        /** send email */
        if(status === 200){
            console.log("send mail")
            await axios.post('/registerMail', { username, email : email, text : msg})
        }

         return Promise.resolve(msg)
    } catch (error) {
        return Promise.reject({ error })
    }
}

export async function verifyPassword({ username, password }){
    
    try {
        if(username){
            const { data } = await axios.post('/login', { username, password })
            return Promise.resolve({ data });
        }
    } catch (error) {
        return Promise.reject({ error : "Password doesn't Match...!"})
    }
    
}

export async function updateUser(response){
    try {
        
        const token = await localStorage.getItem('token');
        const data = await axios.put('/updateuser', response, { headers : { "Authorization" : `Bearer ${token}`}});

        return Promise.resolve({ data })
    } catch (error) {
        return Promise.reject({ error : "Couldn't Update Profile...!"})
    }
}


export async function generateOTP(username){
    try {
        const {data : { code }, status } = await axios.get('/generateOTP', { params : { username }});

        // send mail with the OTP
        
        if(status === 201){
            let { data : { email }} = await getUser( username );
            let text = `Your Password Recovery OTP is ${code}. Verify and recover your password.`;
            await axios.post('/registerMail', { username, email: email, text, subject : "Password Recovery OTP"})
        }
        return Promise.resolve(code);
    } catch (error) {
        return Promise.reject({ error });
    }
}

export async function verifyOTP({ username, code }){
    try {
       const { data, status } = await axios.get('/verifyOTP', { params : { username, code }})
       return { data, status }
    } catch (error) {
        return Promise.reject(error);
    }
}

/** reset password */
export async function resetPassword({ username, password }){
    try {
        const { data, status } = await axios.put('/resetPassword', { username, password });
        return Promise.resolve({ data, status})
    } catch (error) {
        return Promise.reject({ error })
    }
}