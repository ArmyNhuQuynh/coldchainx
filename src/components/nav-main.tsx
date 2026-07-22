import
{
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Link, useLocation } from "react-router-dom"

export function NavMain ( {
  content,
}: {
  content: {
    mainTitle: string
    items: {
      title: string
      url: string
      icon?: any
      isActive?: boolean
      badge?: number
    }[]
  }
} )
{
  const { open, toggleSidebar } = useSidebar()
  const pathname = useLocation().pathname;
  // //console.log( "NavMain: ", ( '/' + pathname.replace( /^\//, '' ).split( '/' ).slice( 0, 2 ).join( '/' ) ) );
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-sm mb-1">{ content.mainTitle }</SidebarGroupLabel>
      <SidebarMenu>
        { content.items.map( ( item ) => (
          <Link to={ item.url } key={ item.title }>
            <SidebarMenuItem onClick={ open ? undefined : toggleSidebar }>
              <SidebarMenuButton tooltip={ item.title } isActive={ ( '/' + pathname.replace( /^\//, '' ).split( '/' ).slice( 0, 3 ).join( '/' ) ) === item.url }>
                { item.icon && <item.icon /> }
                <span>{ item.title }</span>
                {typeof item.badge === "number" && item.badge > 0 && (
                  <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full border border-rose-500 px-1 text-[11px] font-semibold text-rose-700 group-data-[collapsible=icon]:hidden">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </Link>
        ) ) }
      </SidebarMenu>
    </SidebarGroup>
  )
}
