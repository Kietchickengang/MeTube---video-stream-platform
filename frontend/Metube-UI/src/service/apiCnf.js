import axios from "axios"
import { genHash } from "../../../../api_server/src/middleware/hash.js";
const api_port = import.meta.env.VITE_API_SERVER_PORT;
const host = `http://localhost:${api_port}/metube`;

// 4> Upload done confirmation before transcoding (Default)

// 5> Api server checks upload confirmation
const apiCnf = async(key, metadata) => {
    try{
        const { title, description } = metadata;
        const apiRes = await axios.post(`${host}/${key}/cnf`, {
            title: title,
            description: description
        }) 
        return apiRes.data;
    }
    catch(err){
        console.error(`Upload status confirmation failed: ${err} `);
        throw err;
    } 
}

// 6> Api server updates DB with status = "processing"

// --- LOGIC HERE IS STILL INCOMPLETE :) --- 

const apiUpdateDB = async (key) => {
    try{
        await axios.patch(`${host}/${key}/processStatus`);
    }
    catch(err){
        console.error(`Update DB for processing video failed: ${err}`);
        throw err;
    }
}

export const uploadCnf = async(key, metadata) => {
    const hashedKey = genHash(key);

    await apiCnf(hashedKey, metadata);

    await apiUpdateDB(hashedKey);
}