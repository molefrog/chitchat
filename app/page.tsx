import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
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

const integrations = [
  {
    id: "int-1",
    title: "New project Apollo discussion",
    description:
      "Discussing the initial phases of Project Apollo, including team assignments, timeline expectations, and key deliverables for Q1. We need to align on the technical stack and infrastructure requirements.",
    date: new Date(2024, 10, 8, 13, 30), // November 8, 13:30
  },
  {
    id: "int-2",
    title: "Q4 Budget Review Meeting",
    description:
      "Comprehensive review of Q4 spending across all departments. Topics include cost optimization opportunities, resource allocation for upcoming projects, and financial projections for the next quarter.",
    date: new Date(2024, 10, 6, 14, 15), // November 6, 14:15
  },
  {
    id: "int-3",
    title: "Product Roadmap Planning Session",
    description:
      "Strategic planning session to define our product roadmap for 2024. We'll prioritize features based on customer feedback, market research, and technical feasibility to ensure we stay competitive.",
    date: new Date(2024, 10, 3, 10, 0), // November 3, 10:00
  },
  {
    id: "int-4",
    title: "Engineering Team Standup",
    description:
      "Weekly engineering sync to discuss current sprint progress, blockers, and upcoming tasks. The team will share updates on backend optimization, frontend improvements, and infrastructure scaling efforts.",
    date: new Date(2024, 10, 1, 9, 30), // November 1, 9:30
  },
];

export default function Dashboard() {
  return (
    <div className="flex min-h-screen flex-col items-center p-8">
      <div className="fixed top-6 left-8">
        <Image src="/mockmock.svg" alt="MockMock" width={100} height={40} />
      </div>
      <div className="w-full max-w-4xl">
        <header className="mb-12 pt-20">
          <h1 className="text-4xl tracking-tight font-bold text-zinc-900">
            Evan, welcome to MockMock Inc.
          </h1>
          <p className="mt-2 text-zinc-500 text-xl">
            Here is what has been happening at the company recently
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-2 auto-rows-fr">
          {conversations.map((conversation) => (
            <Link
              key={conversation.id}
              href={`/chats/${conversation.id}?title=${encodeURIComponent(conversation.title)}`}
              className="group block "
            >
              <div className="overflow-hidden rounded-lg bg-zinc-100 flex gap-4 p-2.5 items-center relative">
                <div className="aspect-square w-26 h-26 rounded-lg bg-white shadow-ds-border-small p-1 -rotate-1">
                  <div className="w-full h-full bg-zinc-200 rounded-md"></div>
                </div>
                <div className="ml-2 flex-1">
                  <p className="mt-1 text-lg/snug text-zinc-900 font-medium line-clamp-2">
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

        <section className="mt-16 pb-32">
          <h2 className="text-3xl font-bold text-zinc-900 mb-6">Integrations</h2>
          <div className="flex flex-col gap-3.5">
            {integrations.map((integration) => (
              <Link
                key={integration.id}
                href={`/chats/${integration.id}?title=${encodeURIComponent(integration.title)}`}
                className="group block"
              >
                <div className="overflow-hidden rounded-lg bg-zinc-100 px-6 py-6 flex items-center gap-8">
                  <div className="w-14 h-14 border border-zinc-200 rounded-xl shrink-0 ml-2 flex items-center justify-center bg-white">
                    <Image src="/notion-logo.svg" alt="Notion" width={32} height={32} />
                  </div>

                  <div className="flex-1">
                    <div className="mb-2.5 flex items-center gap-2">
                      <h3 className="text-xl font-medium text-zinc-900 flex-1">
                        {integration.title}
                      </h3>

                      <span className="inline-block  px-2.5 py-px text-sm font-medium text-zinc-500/75 border border-zinc-300 rounded-full">
                        {format(integration.date, "MMMM d, HH:mm")}
                      </span>
                    </div>
                    <p className="text-base text-pretty text-zinc-600 line-clamp-3 mr-8 leading-relaxed">
                      {integration.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
