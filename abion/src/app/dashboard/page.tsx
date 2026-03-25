import { getSupabaseAdminClient } from '@/lib/supabase';
import Link from 'next/link';
import AutoRefresh from './auto-refresh';

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 10;

type Conversation = {
  id: string;
  sender_id: string;
  platform: string;
  message: string;
  ai_response: string;
  created_at: string;
};

function formatDate(isoDate: string) {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleString();
}

function platformBadge(platform: string) {
  const map: Record<string, { label: string; color: string }> = {
    widget: { label: '🌐 Widget', color: 'bg-blue-100 text-blue-700' },
    instagram: { label: '📸 Instagram', color: 'bg-pink-100 text-pink-700' },
    whatsapp: { label: '💬 WhatsApp', color: 'bg-green-100 text-green-700' },
  };
  const p = map[platform] ?? { label: platform, color: 'bg-slate-100 text-slate-600' };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${p.color}`}>
      {p.label}
    </span>
  );
}

function buildHref(senderFilter: string, platformFilter: string, page: number) {
  const params = new URLSearchParams();
  if (senderFilter.trim()) params.set('sender', senderFilter.trim());
  if (platformFilter) params.set('platform', platformFilter);
  if (page > 1) params.set('page', String(page));
  const q = params.toString();
  return q ? `/dashboard?${q}` : '/dashboard';
}

export default async function DashboardPage(props: {
  searchParams?: Promise<{ sender?: string; page?: string; platform?: string }> | { sender?: string; page?: string; platform?: string };
}) {
  const resolved = props.searchParams ? await props.searchParams : undefined;
  const senderFilter = resolved?.sender?.trim() ?? '';
  const platformFilter = resolved?.platform?.trim() ?? '';
  const pageFromQuery = Number.parseInt(resolved?.page ?? '1', 10);
  const currentPage = Number.isFinite(pageFromQuery) && pageFromQuery > 0 ? pageFromQuery : 1;
  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
          Supabase not configured. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local
        </p>
      </main>
    );
  }

  // Stats
  const [{ count: totalConvos }, { count: todayConvos }, { count: widgetConvos }] = await Promise.all([
    supabase.from('conversations').select('*', { count: 'exact', head: true }),
    supabase.from('conversations').select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString()),
    supabase.from('conversations').select('*', { count: 'exact', head: true })
      .eq('platform', 'widget'),
  ]);

  // Conversations query
  let query = supabase
    .from('conversations')
    .select('id, sender_id, platform, message, ai_response, created_at', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (senderFilter) query = query.ilike('sender_id', `%${senderFilter}%`);
  if (platformFilter) query = query.eq('platform', platformFilter);

  const { data, error, count } = await query.range(from, to);
  const conversations = (data ?? []) as Conversation[];
  const totalCount = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <div className="min-h-screen bg-slate-50">
      <AutoRefresh intervalMs={10000} />

      {/* Top nav */}
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xl font-extrabold text-[#0A1F44]">Abion</Link>
            <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">● Live</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/settings"
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              ⚙️ Settings
            </Link>
            <Link
              href="/dashboard/widget-settings"
              className="rounded-lg bg-[#0A1F44] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-900"
            >
              🌐 Widget
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">

        {/* Stats row */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          {[
            { label: 'Total conversations', value: totalConvos ?? 0, icon: '💬' },
            { label: 'Today', value: todayConvos ?? 0, icon: '📅' },
            { label: 'Widget chats', value: widgetConvos ?? 0, icon: '🌐' },
          ].map(stat => (
            <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xl">{stat.icon}</p>
              <p className="mt-1 text-2xl font-extrabold text-[#0A1F44]">{stat.value}</p>
              <p className="mt-0.5 text-xs text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <form action="/dashboard" method="get" className="mb-6 flex flex-wrap gap-3">
          <input
            name="sender"
            defaultValue={senderFilter}
            placeholder="Filter by sender ID..."
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none focus:border-[#0A1F44] focus:ring-1 focus:ring-[#0A1F44]"
          />
          <select
            name="platform"
            defaultValue={platformFilter}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:border-[#0A1F44]"
          >
            <option value="">All platforms</option>
            <option value="widget">Widget</option>
            <option value="instagram">Instagram</option>
            <option value="whatsapp">WhatsApp</option>
          </select>
          <button type="submit" className="rounded-lg bg-[#0A1F44] px-4 py-2 text-sm font-medium text-white hover:bg-blue-900">
            Filter
          </button>
          <Link href="/dashboard" className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
            Clear
          </Link>
        </form>

        {/* Table */}
        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
            Failed to load: {error.message}
          </div>
        ) : conversations.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
            <p className="text-4xl">💬</p>
            <p className="mt-3 font-semibold text-slate-700">No conversations yet</p>
            <p className="mt-1 text-sm text-slate-500">Try the widget demo to send your first message.</p>
            <Link href="/widget-demo" className="mt-4 inline-block rounded-full bg-[#0A1F44] px-6 py-2 text-sm font-semibold text-white hover:bg-blue-900">
              Open widget demo →
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-4 py-3 font-semibold text-slate-700">Platform</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Sender</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Message</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">AI Reply</th>
                  <th className="px-4 py-3 font-semibold text-slate-700 whitespace-nowrap">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {conversations.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">{platformBadge(c.platform ?? 'instagram')}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{c.sender_id}</td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="line-clamp-2 text-slate-800">{c.message}</p>
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="line-clamp-2 text-slate-600">{c.ai_response}</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-400">{formatDate(c.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalCount > PAGE_SIZE && (
          <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
            <p>Showing {from + 1}–{Math.min(from + conversations.length, totalCount)} of {totalCount}</p>
            <div className="flex gap-2">
              {hasPrevious ? (
                <Link href={buildHref(senderFilter, platformFilter, currentPage - 1)} className="rounded-lg border border-slate-300 px-3 py-1.5 hover:bg-slate-50">← Prev</Link>
              ) : <span className="rounded-lg border border-slate-200 px-3 py-1.5 text-slate-300">← Prev</span>}
              <span className="px-3 py-1.5">Page {currentPage} of {totalPages}</span>
              {hasNext ? (
                <Link href={buildHref(senderFilter, platformFilter, currentPage + 1)} className="rounded-lg border border-slate-300 px-3 py-1.5 hover:bg-slate-50">Next →</Link>
              ) : <span className="rounded-lg border border-slate-200 px-3 py-1.5 text-slate-300">Next →</span>}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
