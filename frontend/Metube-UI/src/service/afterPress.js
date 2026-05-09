import axios from "axios"

const api_port = import.meta.env.VITE_API_SERVER_PORT;
const host = `http://localhost:${api_port}/metube`;

// 7> Api server updates DB (status = "processing" + title + description + thumbnails)
const apiUpdateDB = async(key, metadata) => {
    try{
        await axios.patch(`${host}/${key}/goPublish`, metadata);
    }
    catch(err){
        console.error(`Update DB for processing video failed: ${err}`);
        throw err;
    }
}

// 8> Api server calls worker server to handle next steps
const callWorker = async() => {

}

export const whenSubmit = async(key, metadata) => {
    await apiUpdateDB(key, metadata);
    await callWorker();
}
