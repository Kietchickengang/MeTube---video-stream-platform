import { useState } from "react";
import '../../public/upVideo.css';
import * as icon from 'lucide-react';

export const UpVideo = () => {
    return (
        <div className="upVideoBox">
            <div className="p1">
                <p>Upload your video</p>
                <div className="ext&info" style={{display: "flex", flexDirection: 'row', gap: '10px', alignItems: 'center', justifyContent: 'center'}}>
                    <icon.Info style={{width: '2vw', height: '2vw', fontStyle: 'normal'}} className="p1_Icon1"></icon.Info>
                    <icon.X style={{width: '2vw', height: '2vw'}} className="p1_Icon2"></icon.X>
                </div>
            </div>
            <div className="divider"></div>
            <div className="p2">
                <div className="upVideoIco"><icon.Upload style={{width: '5vw', height: '5vw'}} color="#C0C0C0"></icon.Upload></div>
                <div style={{fontSize: "1.25vw", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
                    <p>Drag and drop video file to upload</p>
                    <p style={{marginTop: "1px"}}>Your video will be private until you publish it.</p>
                </div>
                <button className="chooseVideoBtn">Select video</button>
            </div>
            <div className="p3">
                <div style={{fontSize: "1.1vw", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
                    <p>By uploading videos to Metube, you confirm that you agree to our <span>Terms of Service</span> and <span>Community Guidelines</span>.</p>
                    <p style={{marginTop: "0"}}>You need to ensure you don't infringe on anyone's copyright or privacy rights. <span>Learn more</span>.</p>
                </div>
            </div>
        </div>
    )
}

export const DetailStep = () => {
    return (
        <div className="upVideoBox">
            <div className="p1" style={{}}>
                <p></p>
                <div className="ext&info" style={{display: "flex", flexDirection: 'row', gap: '10px', alignItems: 'center', justifyContent: 'center'}}>
                    <icon.Info style={{width: '2vw', height: '2vw', fontStyle: 'normal'}} className="p1_Icon1"></icon.Info>
                    <icon.X style={{width: '2vw', height: '2vw'}} className="p1_Icon2"></icon.X>
                </div>
            </div>
            <div className="divider"></div>
            <div className="detailStepBody" style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: '1.5vw'}}>
                <div className="leftBody">
                    <div className="detailBlock">
                        <p style={{marginBottom: '1.8vh'}}>Detail</p>
                        <div className="titleBox" style={{fontSize: '1.1vw', border: '1px solid #848482', borderRadius: '10px', padding: '0 0.5vw 0 0.5vw'}}>
                            <p>Title (required) <icon.CircleQuestionMark style={{width: '1vw', height: '1vw'}}></icon.CircleQuestionMark></p>
                            <textarea className="txtAreaBox" maxLength={100} spellCheck={false} required style={{resize: 'none', width: '40vw', height: '3.5vh', border: 'none', backgroundColor: '#555555'}}
                                placeholder="Add a title that describes your video (type @ to mention a channel)">
                            </textarea>
                        </div>
                        <div className="descriptionBox" style={{fontSize: '1.1vw', border: '1px solid #848482', borderRadius: '10px', padding: '0 0.5vw 0 0.5vw', marginTop: '2.5vh'}}>
                            <p>Description (required) <icon.CircleQuestionMark style={{width: '1vw', height: '1vw'}}></icon.CircleQuestionMark></p>
                            <textarea className="txtAreaBox" maxLength={5000} spellCheck={false} required style={{resize: 'none', width: '40vw', height: '15vh', border: 'none', backgroundColor: '#555555'}}
                                placeholder="Tell viewers about your video (type @ to mention a channel)">
                            </textarea>
                        </div>
                    </div>
                </div>
                <div className="rightBody" style={{width: '45vh', height: '45vh', border: '1px solid red', borderRadius: '10px', marginTop: '16vh'}}>
                    <div className="sampleMiniVideo"></div>
                    <div className="videoName_videoURL"></div>
                </div>
            </div>
        </div>
    )
}
