import React from 'react'
import Navbar from '../../Shared/AdminSidebar/AdminSidebar'
import '../../Layout/Collapse/Collapse.css';

const Dashboard = () => {
    const [collapsed, setCollapsed] = React.useState(false);
  return (
     <div className='CollapseContainer'>
      <Navbar onToggleSidebar={setCollapsed} />
      <div className={`Collapse ${collapsed ? 'collapsed' : ''}`}>
      
    </div>
    </div>
  )
}

export default Dashboard
