import axios from "axios"

const api_port = import.meta.env.VITE_API_SERVER_PORT;
const host = `http://localhost:${api_port}/metube`;

// 6> Upload image to S3 (UI)
// 7> Api server updates DB (status = "processing" + title + description)
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
const callWorker = async(videoId, thumbIn4) => {
    // Push jobs to Message queue
    try{
        const { timestamp, file } = thumbIn4;
        await axios.post(`${host}/${videoId}/wrkJobs`, {
            timestamp: timestamp,
            file: file,
        });
    }
    catch(err){
        console.error(`Failed to call worker server: ${err}`);
        throw err;
    }
}

export const whenSubmit = async(key, metadata) => {
    const { title, description, status, thumbIn4 } = metadata;
    
    await apiUpdateDB(key, {
        title: title,
        description: description,
        status: status,
    });

    await callWorker(key, thumbIn4);
}
