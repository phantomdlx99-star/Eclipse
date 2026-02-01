// components/app-sidebar.tsx
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { History } from "lucide-react";
import Link from "next/link";

export function AppSidebar({ history }: { history: any[] }) {
  return (
    <Sidebar variant="inset">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-center font-bold text-3xl font-display text-transparent bg-clip-text bg-linear-to-r from-primary to-white mb-10 relative after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-gray-400 after:left-1 after:right-7 after:-bottom-5 after:rounded-full">
            Quiz History
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {history.map((item) => (
                <SidebarMenuItem key={item._id}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={`/quiz-generator/${item._id}`}
                      className="w-full h-auto rounded-[7px]"
                    >
                      <History className="mr-2 h-4 w-4" />
                      <h2 className="text-lg font-display capitalize">
                        {item.subjectId}: {item.chapterId}
                      </h2>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
