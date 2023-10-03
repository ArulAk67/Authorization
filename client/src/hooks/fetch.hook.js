import axios from "axios";
import { useEffect, useState } from "react";
import { getUser, getUsername } from '../helper/helper'

axios.defaults.baseURL = "https://mern-backend-6mj8.onrender.com/user";



/** custom hook */
export default function useFetch(query){
    const [getData, setData] = useState({ isLoading : false, apiData: undefined, status: null, serverError: null })
    
    useEffect(() => {

        if(!query) return;
        const fetchData = async () => {
            try {
                setData(prev => ({ ...prev, isLoading: true}));

                 const { username } = !query ? await getUsername() : '';
                
                //  const { data, status } = !query ? await getUser(username) : await getUser(query);
                
                const { data, status } = await getUser(query);
                
                setData(prev=>({...prev,apiData:data}))
                 if(status === 200){
                    setData(prev => ({ ...prev, isLoading: false}));
                    setData(prev => ({ ...prev, apiData : data, status: status }));
                }

                setData(prev => ({ ...prev, isLoading: false}));
            } catch (error) {
                setData(prev => ({ ...prev, isLoading: false, serverError: error }))
            }
        };
        fetchData()

    }, [query]);


    return [getData, setData];
}