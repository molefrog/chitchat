import Link from "next/link";
import { ChevronRight, Plus } from "lucide-react";

const conversations = [
  {
    id: "1",
    title: "Building a SaaS Product",
    description: "Team structure and product roadmap",
  },
  {
    id: "2",
    title: "Understanding AI Agents",
    description: "How autonomous agents work and how they can be used to build a better future",
  },
  {
    id: "3",
    title: "Project Timeline Management",
    description: "Sprint planning and task allocation",
  },
  {
    id: "4",
    title: "Company Reorganization",
    description: "New org chart after merger",
  },
];

export default function Dashboard() {
  return (
    <div className="flex min-h-screen flex-col items-center p-8">
      <div className="w-full max-w-4xl">
        <header className="mb-12 pt-12">
          <h1 className="text-4xl tracking-tight font-bold text-zinc-900">
            Welcome to MockMock Inc.
          </h1>
          <p className="mt-2 text-zinc-500 text-lg">
            Here is what has been happening at the company recently
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-2 auto-rows-fr">
          {conversations.map((conversation) => (
            <Link key={conversation.id} href={`/chats/${conversation.id}`} className="group block ">
              <div className="overflow-hidden rounded-lg bg-zinc-100 flex gap-4 p-2.5 items-center relative">
                <div className="aspect-square w-26 h-26 rounded-lg bg-white shadow-ds-border-small p-1 -rotate-1">
                  <div className="w-full h-full bg-zinc-200 rounded-md"></div>
                </div>
                <div className="ml-2 flex-1">
                  <p className="mt-1 text-lg/snug text-zinc-900 text-medium line-clamp-2">
                    {conversation.description}
                  </p>
                </div>
                <ChevronRight className="w-6 h-6 text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity mr-2 ml-1" />
              </div>
            </Link>
          ))}

          <Link href="/chats/new" className="group block h-full">
            <div className="overflow-hidden rounded-lg bg-zinc-100 flex gap-4 p-2.5 items-center relative h-full justify-center">
              <div className="flex items-center gap-3 ml-2 group">
                <Plus className="w-6.5 h-6.5 text-zinc-400 group-hover:text-zinc-500 transition-colors" />
                <p className="text-xl text-zinc-400 font-bold group-hover:text-zinc-500 transition-colors">
                  New Canvas
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
