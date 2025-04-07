import React from 'react';
import { Outlet } from 'react-router-dom';


const ALayout = () => {
    return (
        <div className='ALayout'>
        <div id="admin">
            <div id="admin_body" class="scrollspy-example">
                <Outlet/>
            </div>
               
        </div>
       
        </div>
    );
};

export default ALayout;