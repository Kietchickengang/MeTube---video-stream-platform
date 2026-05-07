import React, { useState, useRef , useEffect } from 'react';
import { Info, X, Upload, CircleHelp, ImagePlus, Sparkles, Pyramid, SearchCheck, LoaderCircle} from 'lucide-react';

import { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { notifyError, notifySuccess, notifyEmpty } from '../helper/popUp.js';

// S1 - Presigned URL
// S2 - Initialize DB with videoId & status = "uploading"
// S3 - Upload raw video to Vietnix
import { uploadS3 } from '../service/uploadRaw.js'; 

// S4 - Upload done & confirm with api server
// S5 - Api server checks upload confirmation
// S6 - Api server updates DB with status = "processing"
import { uploadCnf } from '../service/apiCnf.js';

// S7 - When 

const UploadWizard = ({closeUploadPage}) => {
    const [page, setPage] = useState(1); // Page 1: Upload, Page 2: Details
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [previewVid, setPreviewVid] = useState(null);
    const [progress, setProgress] = useState(0);
    const [vidKey, setVidKey] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    // Handle Click to choose file video
    const fileInputRef = useRef(null);
    const onButtonClick = () => {
        fileInputRef.current.click();
    };

    // --- LOGIC HANDLE FILE---
    const handleFiles = (files) => {
        const uploadedFile = files[0];
        // Security check: Only allow video file
        if (uploadedFile && uploadedFile.type.startsWith('video/')) {
            setFile(uploadedFile);
            setPage(2); // Auto go to Detail
        } else {
            alert("Please select valid file (mp4, mov...)");
        }
    };

    const onDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = () => setIsDragging(false);

    const onDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
    };

    // --- VIDEO PREVIEW ---
    // Create local URL when user selected file
    useEffect(() => {
        if(file){
            // Create a temporary URL for video file
            const tmpURL = URL.createObjectURL(file);
            setPreviewVid(tmpURL);

            const startVideoProcess = async() => {
                try{
                    // Progress bar starts with 0%
                    setProgress(0);
                    const key = await uploadS3(file, (percent) => setProgress(percent));
                    // Save video key for next step
                    setVidKey(key)
                    // UI confirms upload status with api server
                    // Api server checks UI's confirmation & updates DB status
                    await uploadCnf(key, {
                        title: title,
                        description: description,
                    });
                }
                catch(err){
                    console.error(err);
                    notifyError(err.message); // Use "err" will trigger error
                }
            }
            // Start upload video process right after user dragged or selected file
            startVideoProcess();

            // Clean up to prevent memory leak
            return () => URL.revokeObjectURL(tmpURL);
        }
    }, [file]);

    // --- LOGIC HANDLE WHEN PRESS BUTTON ---
    const handleSubmit = async (e) => {
        // Avoid reload page
        e.preventDefault();

        // Warning if have any empty input
        if(!title.trim() || !description.trim()){
            notifyEmpty(`Your ${!title.trim()? "title" : "description"}`);
            return;
        }

        // All requirement satisfied then
        // --- HANDLE UPLOAD PROCEDURE ---
        try{
            // Push lefting jobs for worker server to handle
        }
        catch(err){
            console.error("Upload Error:", err);
        }
    };

    // --- UPLOAD FORM ---
    const UploadStep = () => (
        <div className="container d-flex justify-content-center align-items-center">
            <div 
                className={`card bg-dark text-white shadow-lg w-100 ${isDragging ? 'border-primary' : 'border-secondary'}`}
                style={{ minHeight: '500px', maxWidth: '1000px', borderRadius: '15px', borderStyle: isDragging ? 'dotted' : 'solid', borderWidth: '2px', transition: 'all 0.2s ease'}}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
            >
            {/* Stablize card when dragging video file */}
            <div className={`card-content ${isDragging ? 'pointer-events-none' : ''}`} style={{ pointerEvents: isDragging ? 'none' : 'auto' }}>
                <div className="card-header d-flex justify-content-between align-items-center border-secondary py-3">
                    <h5 className="mb-0 fw-bold">Upload your video</h5>
                    <X className="text-secondary cursor-pointer" size={22} color='white' onClick={closeUploadPage}/>
                </div>
                <div className="card-body text-center py-3 mt-12">
                    <div className="upload-icon-wrapper mb-3">
                        <div className={`d-inline-block p-4 rounded-circle ${isDragging ? 'bg-light' : 'bg-secondary'} bg-opacity-25`}>
                            <Upload size={80} className={isDragging ? 'text-primary' : 'text-secondary'} />
                        </div>
                    </div>
                    <div className="mb-4">
                        <p className="fs-5 mb-1">{isDragging ? "Drop it here" : "Drag and drop video file to upload"}</p>
                        <p className="text-secondary small">Your videos will be private until you publish them</p>
                    </div>
                    <input // Hide input file 
                        type="file" 
                        id="fileInput" 
                        className="d-none"
                        accept="video/*" 
                        ref={fileInputRef}
                        onChange={(e) => handleFiles(e.target.files)} 
                    />
                    <button type="button" className="btn btn-outline-danger" onClick={onButtonClick}>Select video</button>
                    <div className="mb-3 mt-20">
                        <p className="text-secondary small mb-1">By submitting your video, you acknowledge that you agree to 
                            <span style={{color: '#0099FF', cursor: 'pointer'}}>&nbsp;MeTube's Terms of Service</span> and 
                            <span style={{color: '#0099FF', cursor: 'pointer'}}>&nbsp;Community Guidelines</span>.</p>
                        <p className="text-secondary small">You must ensure that you do not violate the copyright or privacy of others.</p>
                    </div>
                </div>
            </div>
        </div>       
    </div>
);

    return page === 1? <UploadStep/> : (
        <DetailStep
            file={file}
            previewVid={previewVid}
            progress={progress}
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            handleSubmit={handleSubmit}
            setPage={setPage}
        />
    );
};

// --- DETAIL STEP ---
    const DetailStep = ({ file, previewVid, progress, title, setTitle, description, setDescription, handleSubmit, setPage }) => {
        const thumbnailExt = [
            {icon: ImagePlus, content: "Upload file"},
            {icon: Sparkles , content: "Auto generate"},
            {icon: Pyramid  , content: "A/B testing"},
        ];

        return (
        <form onSubmit={handleSubmit}> 
        {/* Customize warning message if errors happen */}
        <Toaster
            position="top-right"
            reverseOrder={false}
        />
        <div className="container mt-5 pb-5">
            <div className="card bg-dark text-white shadow-lg border-0" style={{ borderRadius: '25px', maxWidth: '1100px'}}>
                <div className="card-header d-flex justify-content-between align-items-center border-secondary py-3 bg-transparent">
                    <h5 className="mb-0 fw-bold text-truncate" style={{maxWidth: '70%'}}>File: {file?.name}</h5>
                    <X className="text-secondary cursor-pointer" onClick={() => setPage(1)} size={20} />
                </div>
                <div className="card-body p-4" style={{ 
                    maxHeight: '70vh',
                    overflowY: 'auto', 
                    padding: '1.5rem',
                    scrollbarWidth: 'thin', 
                    scrollbarColor: '#444 transparent' 
                }}>
                    <div className="row g-4">
                        <h4 className="mb-2">Details</h4>
                        <div className="col-lg-8">
                            <div className="mb-4 p-3 border border-secondary rounded bg-dark">
                                <label className="form-label text-secondary small d-flex align-items-center gap-1">
                                    Title (required) <CircleHelp size={14} />
                                </label>
                                <textarea value={title} spellCheck="false" maxLength="100" className="form-control bg-transparent text-white border-0 p-0 shadow-none" rows="1" placeholder="Give your video a cool title..." style={{ resize: 'none' }} 
                                    onChange={(e) => setTitle(e.target.value)}/>
                            </div>
                            <div className="mb-4 p-3 border border-secondary rounded bg-dark">
                                <label className="form-label text-secondary small d-flex align-items-center gap-1">
                                    Description <CircleHelp size={14} />
                                </label>
                                <textarea value={description} spellCheck="false" maxLength="100" className="form-control bg-transparent text-white border-0 p-0 shadow-none" rows="4" placeholder="Tell viewers more..." style={{ resize: 'none' }}
                                    onChange={(e) => setDescription(e.target.value)}/>
                            </div>
                            <div>
                                <label className="form-label">
                                    <p className='text-[md]-white font-semibold mb-0.5'>Thumbnail generate</p>
                                    <p className='text-[#666666] text-sm mb-1'>Choose a compelling thumbnail to grab viewers' attention. 
                                        <span style={{color: '#007FFF'}}>&nbsp;Learn more</span>
                                    </p>
                                </label>

                                <div className='flex flex-row gap-2 cursor-pointer'>
                                    {thumbnailExt.map((e,idx) => {
                                        const {icon:Icon, content} = e;
                                        return (
                                            <div key={idx} className="group flex flex-col align-items-center justify-content-center hover:bg-gray-500 transition duration-300" 
                                                style={{width: '170px', height: '85px', border: '1px dashed #666'}}>
                                                <Icon size={24} style={{margin: '15px 0 1px 0'}}/>
                                                <p className="text-[#666666] text-sm group-hover:text-white">{content}</p>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="card bg-black border-secondary">
                                <div className="ratio ratio-16x9 bg-secondary bg-opacity-25 d-flex align-items-center justify-content-center">
                                    {
                                        (previewVid && progress === 100)? (
                                           <video src={previewVid} autoPlay loop controls className="w-100 h-100 rounded-tl rounded-tr" style={{objectPosition:'contain'}}/>
                                        ):(<span className="text-secondary small text-center px-2 italic mt-2">Video Preview</span>)
                                    }
                                </div>
                                <div className="card-body p-3">
                                    <div className="progress bg-secondary bg-opacity-25" style={{height: '7px'}}>
                                        <div className={`progress-bar ${progress < 100? "progress-bar-striped" : ""} progress-bar-animated`} style={{width: `${progress}%`}}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-footer border-secondary flex flex-row align-items-center justify-between p-3 bg-transparent py-1">
                    {progress === 100? 
                        (<p className="text-[#666666] text-sm flex flex-row gap-2 mt-3"><SearchCheck color='white'></SearchCheck>Inspection completed. No issues found.</p>):
                        (<p className="text-[#666666] text-sm flex flex-row gap-2 mt-3">Loading<LoaderCircle color='white' className='animate-spin'></LoaderCircle></p>)
                    }
                        <button type="submit" disabled={progress < 100} className="btn btn-primary px-4 fw-bold">PUBLISH</button>
                </div>
            </div>
        </div>
        </form>
    )};

export default UploadWizard;