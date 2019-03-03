import React, { useState, useEffect } from 'react';

function Footer(props){
    return (
        <div id="footer">
            <div id="version">React Version: {React.version}</div>
        </div>
    );
}

export {Footer};