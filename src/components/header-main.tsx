import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useTheme } from "@/providers/theme-provider"
import { PATH_AUTH } from "@/routes/path"
import { PATH_DISPATCHER_DASHBOARD } from "@/routes/path"
import { Bell, CheckCheck, Loader2, LogOut, Moon, PanelLeft, Settings, Snowflake, Sun } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useSidebar } from "./ui/sidebar"
import { useNotification } from "@/hooks/use-notification"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"
import { formatIncidentDate } from "./incidents/incident-formatters"
import type { TNotification } from "@/schemas/notification.schema"
import { toast } from "sonner"

const HeaderMain = () => {
    const navigate = useNavigate();
    // const pathname = useLocation().pathname;
    // const navigate = useNavigate();
    const { isMobile, toggleSidebar } = useSidebar();
    const { setTheme } = useTheme();
    const role = useSelector((state: RootState) => state.user.role);
    const isDispatcher = role === "Dispatcher";
    const { getNotifications, getUnreadCount, markRead, markAllRead } = useNotification();
    const notificationsQuery = getNotifications({ pageNumber: 1, pageSize: 20 }, isDispatcher);
    const unreadQuery = getUnreadCount(isDispatcher);
    const notifications = notificationsQuery.data?.data ?? [];

    const getNotificationIncidentId = (notification: TNotification) => {
        const data = notification.data;
        const dataId = data?.incidentId ?? data?.IncidentId ?? data?.referenceId ?? data?.ReferenceId;
        return typeof dataId === "string" && dataId.trim()
            ? dataId
            : notification.referenceId || null;
    };

    const handleNotificationClick = async (notification: TNotification) => {
        if (!notification.isRead && notification.notificationId) {
            try {
                await markRead.mutateAsync(notification.notificationId);
            } catch {
                toast.error("Không thể đánh dấu thông báo đã đọc.");
            }
        }
        const incidentId = getNotificationIncidentId(notification);
        if (notification.type === "INCIDENT_WORKFLOW" && incidentId) {
            navigate(PATH_DISPATCHER_DASHBOARD.incident.detail(incidentId));
        }
    };
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
        <nav className="pointer-events-none absolute right-0 top-0 z-30 flex h-16 items-center p-3">
            <div className="pointer-events-auto flex items-center gap-2">
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
                                        className="rounded-full border border-primary/20 bg-card/90 text-primary shadow-sm backdrop-blur hover:bg-accent"
                                        onClick={toggleSidebar}
                                    >
                                        <span className="sr-only">Toggle sidebar</span>
                                        <PanelLeft className="size-5" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Hiển thị thanh bên</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}

                    {isDispatcher && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="relative size-11 rounded-full border border-primary/25 bg-card/90 text-primary shadow-sm backdrop-blur hover:bg-accent hover:text-primary"
                                >
                                    <Bell className="size-5" />
                                    {(unreadQuery.data ?? 0) > 0 && (
                                        <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white">
                                            {(unreadQuery.data ?? 0) > 99 ? "99+" : unreadQuery.data}
                                        </span>
                                    )}
                                    <span className="sr-only">Mở thông báo</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[min(92vw,390px)] rounded-lg p-0" align="end" sideOffset={6}>
                                <div className="flex items-center justify-between border-b px-4 py-3">
                                    <div>
                                        <p className="font-semibold">Thông báo Dispatcher</p>
                                        <p className="mt-0.5 text-xs text-muted-foreground">{unreadQuery.data ?? 0} chưa đọc</p>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        disabled={markAllRead.isPending || (unreadQuery.data ?? 0) === 0}
                                        onClick={async (event) => {
                                            event.preventDefault();
                                            try {
                                                await markAllRead.mutateAsync();
                                            } catch {
                                                toast.error("Không thể đánh dấu tất cả đã đọc.");
                                            }
                                        }}
                                    >
                                        <CheckCheck className="h-4 w-4" /> Đọc tất cả
                                    </Button>
                                </div>
                                <div className="max-h-[430px] overflow-y-auto p-2">
                                    {notificationsQuery.isLoading && (
                                        <div className="flex h-28 items-center justify-center"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
                                    )}
                                    {!notificationsQuery.isLoading && notifications.length === 0 && (
                                        <p className="px-4 py-10 text-center text-sm text-muted-foreground">Chưa có thông báo.</p>
                                    )}
                                    {notifications.map((notification) => (
                                        <button
                                            key={notification.notificationId}
                                            type="button"
                                            className={`mb-1 w-full rounded-md border px-3 py-2.5 text-left transition-colors hover:bg-accent ${notification.isRead ? "bg-background" : "border-blue-200 bg-blue-50"}`}
                                            onClick={() => void handleNotificationClick(notification)}
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <p className="line-clamp-1 text-sm font-semibold">{notification.title}</p>
                                                {!notification.isRead && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-600" />}
                                            </div>
                                            <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{notification.body}</p>
                                            <p className="mt-1.5 text-[11px] text-muted-foreground">{formatIncidentDate(notification.createdAt)}</p>
                                        </button>
                                    ))}
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-11 rounded-full border border-primary/25 bg-card/90 text-primary shadow-sm backdrop-blur hover:bg-accent hover:text-primary"
                            >
                                <Snowflake className="size-5" strokeWidth={2.25} />
                                <span className="sr-only">Mở menu ColdchainX</span>
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
