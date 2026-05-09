import axios from "axios"

const api_port = import.meta.env.VITE_API_SERVER_PORT;
const secret_key = import.meta.env.VITE_AES_SECRET_KEY;
const host = `http://localhost:${api_port}/metube`;

// 4> Upload confirmation if done before transcoding (Default)

// 5> Api server checks upload confirmation
const apiCnf = async(key) => {
    try{
        const apiRes = await axios.post(`${host}/${key}/cnf`); 
        return apiRes.data.status;
    }
    catch(err){
        console.error(`Upload status confirmation failed: ${err}`);
        throw err;
    } 
}

// 6> Request worker server to generate thumbnails
const genThumbnail = async() => {

}

export const uploadCnf = async(key) => {
    await apiCnf(key);
}