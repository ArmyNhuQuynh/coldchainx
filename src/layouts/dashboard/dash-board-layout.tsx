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
                <div className='min-w-0 w-full p-4 pt-16 md:p-6 md:pr-20 lg:p-8 lg:pr-24'>
                    <Outlet />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}

export default DashBoardLayout
