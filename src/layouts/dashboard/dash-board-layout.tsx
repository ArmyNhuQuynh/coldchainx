import { AppSidebar } from '@/components/app-sidebar'
import HeaderMain from '@/components/header-main'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Outlet } from 'react-router-dom'

const DashBoardLayout = () =>
{
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <HeaderMain />
                <div className='p-4 md:p-6 lg:p-8'>
                    <Outlet />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}

export default DashBoardLayout