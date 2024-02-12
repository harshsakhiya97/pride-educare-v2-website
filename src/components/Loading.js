import React from 'react';

function Loading() {
    return (
        <div className="loading">
            <div style={{
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                zIndex: "99999",
                position: "fixed",
                opacity: "1",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%"
            }}
            >
                <div style={{
                    zIndex: "99999",
                    minHeight: "100vh"
                }}>
                    <img src={require("../assets/fav-icon.png")} alt="Logo" style={{
                        width: "150px",
                        margin: "0",
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                    }} />
                </div>
            </div>

            {/* Your loading animation or message */}
        </div>
    );
}

export default Loading;