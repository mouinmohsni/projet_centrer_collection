import * as React from "react";

interface ContentData  {
    activePanel : String ;
    setActivePanel : boolean ;
    children: React.ReactNode;
}

const ContentData = () => {
    return (
        <div className="iconbar">
            <h3> data</h3>

        </div>
    );
};

export default ContentData;