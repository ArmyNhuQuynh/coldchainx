import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useTheme } from "@/providers/theme-provider"
import { PATH_AUTH } from "@/routes/path"
import { LogOut, Moon, Settings, Sun } from "lucide-react"
import { Link } from "react-router-dom"
import { useSidebar } from "./ui/sidebar"

const HeaderMain = () => {
    // const pathname = useLocation().pathname;
    // const navigate = useNavigate();
    const { isMobile, toggleSidebar } = useSidebar();
    const { setTheme } = useTheme();
    // const { unReadNumber, setUnReadNumber } = useSignalRContext();
    // const { role } = useSelector((state: RootState) => state.user);
    // const [shouldFetchNotifications, setShouldFetchNotifications] = useState(false);

    // const {
    //     notifications,
    //     totalNotifications,
    //     fetchNextPage,
    //     hasNextPage,
    //     isFetchingNextPage,
    //     deleteNotificationsMutation,
    //     markNotificationAsReadMutation,
    //     isLoading,
    //     refetch
    // } = useNotification( {
    //     enabled: shouldFetchNotifications
    // } );

    // const scrollContainerRef = useRef<HTMLDivElement>(null);

    // const shouldShowBack = () => {
    //     const segments = pathname.split("/").filter(Boolean);
    //     return segments.length >= 4;
    // };

    // const getNotificationIcon = (type: number) => {
    //     return type === 0 ? (
    //         <Info className="h-4 w-4 text-blue-500" />
    //     ) : (
    //         <AlertCircle className="h-4 w-4 text-red-500" />
    //     );
    // };

    // const getNotificationStyle = (type: number, isRead: boolean) => {
    //     return type === 0
    //         ? `border-l-4 border-blue-500 ${isRead ? "bg-blue-0" : "bg-blue-20"}  hover:bg-transparent`
    //         : `border-l-4 border-red-500 ${isRead ? "bg-red-0" : "bg-red-20"} hover:bg-transparent`;
    // };

    // const handleScroll = useCallback( () =>
    // {
    //     const container = scrollContainerRef.current;
    //     if ( !container || !hasNextPage || isFetchingNextPage ) return;

    //     // Calculate if user has scrolled near the bottom (within 100px)
    //     const { scrollTop, scrollHeight, clientHeight } = container;
    //     const scrolledToBottom = scrollHeight - scrollTop - clientHeight < 100;

    //     if ( scrolledToBottom )
    //     {
    //         fetchNextPage();
    //     }
    // }, [ hasNextPage, isFetchingNextPage, fetchNextPage ] );

    // useEffect( () =>
    // {
    //     const container = scrollContainerRef.current;
    //     if ( container )
    //     {
    //         container.addEventListener( 'scroll', handleScroll );
    //         return () => container.removeEventListener( 'scroll', handleScroll );
    //     }
    // }, [ handleScroll ] );

    // const handleClearNotifications = () =>
    // {
    //     deleteNotificationsMutation.mutate();
    //     setUnReadNumber( 0 );
    // };

    // const handleMarkAllAsRead = () =>
    // {
    //     markNotificationAsReadMutation.mutate();
    //     setUnReadNumber( 0 );
    // };



    return (
        <nav className="flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 sticky top-0 z-10">
            <div className="flex items-center gap-2 px-4 justify-between w-full">
                <div className="flex items-center gap-2">
                    {/* {shouldShowBack() && (
                        <>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                navigate('/' + pathname.replace(/^\//, '').split('/').slice(0, 3).join('/'))
                                            }}
                                            className="gap-1 px-2"
                                        >
                                            <ChevronLeft className="h-6 w-6" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Quay lại trang trước</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </>
                    )} */}
                </div>
                <div className="flex items-center gap-2">
                    {isMobile && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="rounded-full bg-card"
                                        onClick={toggleSidebar}
                                    >
                                        <span className="sr-only">Toggle sidebar</span>
                                        {/* <CollapseIcon className="size-6 cursor-pointer text-gray-500 hover:text-gray-700 transition-colors duration-200" /> */}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Hiển thị thanh bên</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}

                    <Separator orientation="vertical" className="h-5" />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full bg-card">
                                {/* <img className="size-7" src={ brandData?.data.data.pictureUrl || storeLogoImage || "https://s3-hcm5-r1.longvan.net/19429498-dimpos/0a8eae54-e987-4205-9fb8-c0e3b5266f9f.jpg" } /> */}
                                <span className="sr-only">Toggle theme</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-(--radix-dropdown-menu-trigger-width) min-w-54 rounded-lg"
                            align="end"
                            side="bottom"
                            sideOffset={4}
                        >
                            <DropdownMenuLabel className="text-sm font-medium">
                                Chế độ giao diện
                            </DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => setTheme("light")} className="gap-2 p-2 hover:cursor-pointer">
                                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                                    <Sun className="size-4" />
                                </div>
                                <div className="text-muted-foreground font-medium">Sáng</div>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("dark")}>
                                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                                    <Moon className="size-4" />
                                </div>
                                <div className="text-muted-foreground font-medium">Tối</div>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("system")}>
                                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                                    <Settings className="size-4" />
                                </div>
                                <div className="text-muted-foreground font-medium">Hệ thống</div>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel className="text-sm font-medium">
                                Cài đặt
                            </DropdownMenuLabel>
                            {/* <Link to={ role === "BrandAdmin" ? PATH_BRAND_DASHBOARD.brand.root : role === "StoreAdmin" ? PATH_STORE_DASHBOARD.storeSettings.root : PATH_ADMIN_DASHBOARD.general.app }>
                                <DropdownMenuItem className="gap-2 p-2 hover:cursor-pointer">
                                    <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                                        <UserCog2 className="size-4" />
                                    </div>
                                    <div className="text-muted-foreground font-medium">Thông tin</div>
                                </DropdownMenuItem>
                            </Link> */}
                            <Link to={PATH_AUTH.logout}>
                                <DropdownMenuItem className="gap-2 p-2 hover:cursor-pointer">
                                    <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                                        <LogOut className="size-4" />
                                    </div>
                                    <div className="text-muted-foreground font-medium">Đăng Xuất</div>
                                </DropdownMenuItem>
                            </Link>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </nav>
    )
}

export default HeaderMain
