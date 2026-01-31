// app/learn/[classId]/[subjectId]/[chapterId]/layout.tsx
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { getQuizHistory } from "@/lib/actions/featuresActions";
import GoBack from "@/components/GoBack";
import { Home } from "lucide-react";
import Link from "next/link";

export default async function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch history data on the server for instant loading
  const history = await getQuizHistory();

  return (
    <SidebarProvider>
      <AppSidebar history={history} />
      <SidebarInset>
        <header className="flex h-auto py-3 items-center justify-between px-4 border-b border-white/10">
          <SidebarTrigger />
          <Link href={"/"}>
            <button className="flex w-auto items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground transition-transform active:scale-95 cursor-pointer hover:scale-105 mt-auto">
              Home
              <Home size={18} />
            </button>
          </Link>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
