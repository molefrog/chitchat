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
    id: "f0c37170-f799-46ad-8c63-d25c9ef402b7",
    title: "15-Min Summary: Nov 8, 15:00-15:15 UTC",
    description:
      "Three new employee profiles created (Harper Nguyen, Indira Kapoor, Samir Desai). Flags project updated with full team roster and planning doc. Website refresh pricing table v1 completed. Q4 lead gen landing page visuals drafted.",
    date: new Date("2025-11-08T15:16:11.43405+00:00"),
  },
  {
    id: "7d923cd0-c3b0-44c6-8d2e-e44472b420b4",
    title: "Hourly Summary: Nov 8, 14:00-15:00 UTC",
    description:
      "Hero section shipped. Flags of the World project kicked off with cross-functional team assignments across Product, Marketing, and Ops.",
    date: new Date("2025-11-08T15:00:57.903589+00:00"),
  },
  {
    id: "089a1457-d406-4c2b-9d73-b417e4a94f6d",
    title: "Flags Project Kickoff Hour",
    description:
      "New project \"Flags of the World\" kicked off by Ops team (Nadia Volkov, Elias Haddock). Q4 lead gen and Website refresh projects progressing. Sales working on pricing tiers.",
    date: new Date("2025-11-08T14:00:48.415031+00:00"),
  },
  {
    id: "aadca968-6032-4eba-ad21-c24c8a0b6fa5",
    title: "Cross-Team Collaboration Snapshot",
    description:
      "Nineteen people across five teams are working on six major projects. The holiday marketing campaign is more than halfway done but Project Apollo is waiting on Marketing assets. Several high priority items need cross-team coordination.",
    date: new Date("2025-11-08T13:10:26.126152+00:00"),
  },
  {
    id: "c3ec16f8-73a0-44d0-9266-da7658d53d18",
    title: "Four Completions Progress Update",
    description:
      "Twenty documents got updates with four tasks completed, eleven making progress, and five new ones created. The big focus is on the holiday lead generation campaign and rolling out new pricing.",
    date: new Date("2025-11-08T12:00:00+00:00"),
  },
  {
    id: "fa4af9b9-08cf-426b-9db6-606358aacf4d",
    title: "Website and Campaign Launch",
    description:
      "Teams across Product, Sales, Marketing, Finance, and Ops are collaborating on the Website Refresh launching early December and a major lead generation campaign wrapping up before the holidays.",
    date: new Date("2025-11-08T10:00:00+00:00"),
  },
  {
    id: "b6414f65-18b7-49e9-9262-59febc3c9853",
    title: "CRM Contacts Win Rate",
    description:
      "Recent activity shows contacts at Acme, Nordic Bikes, and Copenhagen Coffee. Product teams are driving the Website Refresh and holiday lead gen while Sales improved their win rate and Marketing brought down cost per lead.",
    date: new Date("2025-11-07T18:00:00+00:00"),
  },
  {
    id: "7fee814c-fa47-4e9e-8a89-a0f13aa2f5f4",
    title: "Twenty Members Apollo Blitz",
    description:
      "Twenty team members are actively working together on Project Apollo, the holiday marketing blitz, reliability improvements, and the new pricing rollout with lots of coordination between Finance, Marketing, and Sales.",
    date: new Date("2025-11-07T11:00:00+00:00"),
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
                  <Image
                    src="/thumb.png"
                    alt={conversation.title}
                    width={104}
                    height={104}
                    className="w-full h-full object-cover rounded-md"
                  />
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
