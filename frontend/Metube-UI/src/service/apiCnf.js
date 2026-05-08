import axios from "axios"

const api_port = import.meta.env.VITE_API_SERVER_PORT;
const secret_key = import.meta.env.VITE_AES_SECRET_KEY;
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
    await apiCnf(key, metadata);

    await apiUpdateDB(key);
}