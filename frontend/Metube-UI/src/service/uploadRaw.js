import axios from 'axios';
import { genHash } from '../../../../api_server/src/middleware/hash.js';
// .env format in Vite
const api_port = import.meta.env.VITE_API_SERVER_PORT;
const host = `http://localhost:${api_port}/metube`;

export const uploadS3 = async(file, progress) => {
    if(!file) throw new Error('Empty video file'); 
    try{
        const { name, type } = file;

        // 1> Request for presigned URL
        const vietnixRep = await axios.post(`${host}/presigned-URL`,{
            fileName: name,
            contentType: type,
        });

        const { url, key } = vietnixRep.data;
        
        // 2> Initialize status = "uploading" for file video
        try{
            await axios.post(`${host}/${genHash(key)}/initVidDB`)
        }
        catch(err)
        {
            console.error(`Initialize DB for video failed: ${err}`);
            throw err;
        }

        // 3> Upload raw video to Vietnix using presigned URL
        await axios.put(url, file, {
            headers: {
                "Content-Type": file.type,
            },
            // Calculate complete percent & display in progress bar
            onUploadProgress: (e) => {
                const completePercent = Math.round((e.loaded * 100) / e.total);
                if(progress) progress(completePercent);
            }
        })

        // Return key(videoId) for UI to confirm with Api server
        return key;
    }
    catch(err){
        console.error("Error when uploading video to S3: ", err);
        throw err;
    }
}
