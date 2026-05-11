import axios from "axios"

const api_port = import.meta.env.VITE_API_SERVER_PORT;
const host = `http://localhost:${api_port}/metube`;

// 6> Api server updates DB (status = "processing" + title + description + thumbnails)
const apiUpdateDB = async(key, metadata) => {
    try{
        await axios.patch(`${host}/${key}/goPublish`, metadata);
    }
    catch(err){
        console.error(`Update DB for processing video failed: ${err}`);
        throw err;
    }
}

// 7> Api server calls worker server to handle next steps
const callWorker = async(job) => {
    // Push jobs to Message queue
    try{
        const { videoId } = job;
        const key = videoId;
        await axios.post(`${host}/${key}/wrkJobs`);
    }
    catch(err){
        console.error(`Failed to call worker server: ${err}`);
        throw err;
    }
}

export const whenSubmit = async(key, metadata) => {
    const job = {
        videoId: key,
        // Link to folder/file Vietnix to download resources
        videoPath: "",
    }
    await apiUpdateDB(key, metadata);
    await callWorker(job);
}
