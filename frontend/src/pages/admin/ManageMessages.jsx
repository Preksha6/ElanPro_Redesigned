import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Trash2, 
  Check, 
  Mail, 
  Building, 
  Phone, 
  Calendar, 
  Search, 
  MessageSquare, 
  Send,
  User,
  Clock,
  CheckCircle2,
  Inbox
} from 'lucide-react';

export default function ManageMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'unread', 'read'
  const [searchQuery, setSearchQuery] = useState('');
  
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    setLoading(true);
    let finalMessages = [];
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (!error && data && data.length > 0) {
        finalMessages = data;
      } else {
        // Fallback to local storage only if database returned no data or offline
        const localData = JSON.parse(localStorage.getItem('elanpro_contact_messages') || '[]');
        finalMessages = localData;
      }
    } catch (e) {
      console.warn("Supabase fetch notice:", e);
      try {
        finalMessages = JSON.parse(localStorage.getItem('elanpro_contact_messages') || '[]');
      } catch (err) {}
    }

    // Strict deduplication by unique signature
    const uniqueMap = new Map();
    finalMessages.forEach((msg) => {
      const signature = msg.id || `${msg.email}_${msg.product_interest}_${msg.name}`;
      if (!uniqueMap.has(signature)) {
        uniqueMap.set(signature, msg);
      }
    });

    const uniqueList = Array.from(uniqueMap.values());
    uniqueList.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

    setMessages(uniqueList);
    if (uniqueList.length > 0) {
      setSelectedMessage(uniqueList[0]);
    } else {
      setSelectedMessage(null);
    }
    setLoading(false);
  }

  const filteredMessages = useMemo(() => {
    return messages.filter(m => {
      let matchesStatus = true;
      if (filterStatus === 'unread') matchesStatus = m.status === 'unread';
      else if (filterStatus === 'read') matchesStatus = m.status === 'read';
      else if (filterStatus === 'catalogues') {
        matchesStatus = m.product_interest && (
          m.product_interest.toLowerCase().includes('catalogue') || 
          m.product_interest.toLowerCase().includes('brochure') ||
          m.product_interest.toLowerCase().includes('amc')
        );
      }

      const q = searchQuery.toLowerCase().trim();
      const matchesQuery = !q || 
        (m.name && m.name.toLowerCase().includes(q)) ||
        (m.email && m.email.toLowerCase().includes(q)) ||
        (m.company && m.company.toLowerCase().includes(q)) ||
        (m.product_interest && m.product_interest.toLowerCase().includes(q)) ||
        (m.message && m.message.toLowerCase().includes(q));
      return matchesStatus && matchesQuery;
    });
  }, [messages, filterStatus, searchQuery]);

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this client inquiry?')) return;
    try {
      await supabase.from('contact_messages').delete().eq('id', id);
    } catch (e) {
      console.warn(e);
    }

    try {
      const localData = JSON.parse(localStorage.getItem('elanpro_contact_messages') || '[]');
      localStorage.setItem('elanpro_contact_messages', JSON.stringify(localData.filter(m => m.id !== id)));
    } catch (e) {}

    toast({ title: 'Success', description: 'Inquiry deleted successfully.' });
    const updated = messages.filter(m => m.id !== id);
    setMessages(updated);
    if (selectedMessage?.id === id) {
      setSelectedMessage(updated[0] || null);
    }
  }

  async function handleToggleStatus(id, currentStatus) {
    const nextStatus = currentStatus === 'read' ? 'unread' : 'read';
    try {
      await supabase
        .from('contact_messages')
        .update({ status: nextStatus })
        .eq('id', id);
    } catch (e) {
      console.warn(e);
    }

    try {
      const localData = JSON.parse(localStorage.getItem('elanpro_contact_messages') || '[]');
      localStorage.setItem('elanpro_contact_messages', JSON.stringify(
        localData.map(m => m.id === id ? { ...m, status: nextStatus } : m)
      ));
    } catch (e) {}

    setMessages(messages.map(m => m.id === id ? { ...m, status: nextStatus } : m));
    if (selectedMessage?.id === id) {
      setSelectedMessage({ ...selectedMessage, status: nextStatus });
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-black tracking-tight text-slate-900">Client Inquiries</h1>
          <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1 font-medium">
            <Inbox className="w-4 h-4 text-[#0284c7]" />
            Commercial quote requests & product inquiries ({messages.length} total)
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search by client name, email, company, or equipment interest..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs bg-slate-50 border-slate-200"
          />
        </div>
        <div className="flex items-center gap-1.5 w-full sm:w-auto flex-wrap">
          {[
            { id: 'all', label: 'All Inquiries' },
            { id: 'unread', label: 'Unread' },
            { id: 'read', label: 'Read' },
            { id: 'catalogues', label: '📖 Literature & AMC Requests' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                filterStatus === tab.id 
                  ? 'bg-[#0284c7] text-white shadow-xs' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Messages List (5 Cols) */}
        <div className="lg:col-span-5 space-y-3 overflow-y-auto max-h-[72vh] custom-scrollbar pr-1">
          {loading ? (
            <div className="text-center py-12 text-slate-400 font-medium">Loading inquiries...</div>
          ) : filteredMessages.length === 0 ? (
            <div className="text-slate-400 p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center text-sm font-medium">
              No inquiries found matching criteria.
            </div>
          ) : (
            filteredMessages.map((msg) => {
              const isSelected = selectedMessage?.id === msg.id;
              const isUnread = msg.status === 'unread';
              const isLiteratureRequest = msg.product_interest && (
                msg.product_interest.toLowerCase().includes('catalogue') ||
                msg.product_interest.toLowerCase().includes('brochure') ||
                msg.product_interest.toLowerCase().includes('amc')
              );

              return (
                <div 
                  key={msg.id} 
                  onClick={() => setSelectedMessage(msg)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                    isSelected 
                      ? 'border-[#0284c7] bg-sky-50/50 shadow-xs' 
                      : 'border-slate-200/80 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      {isUnread && (
                        <span className="w-2 h-2 rounded-full bg-[#0284c7] shrink-0" />
                      )}
                      <h3 className={`text-sm ${isUnread ? 'font-black text-slate-900' : 'font-semibold text-slate-700'}`}>
                        {msg.name}
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                      {new Date(msg.created_at || Date.now()).toLocaleDateString()}
                    </span>
                  </div>

                  {msg.company && (
                    <div className="text-xs text-slate-500 font-medium mb-1 flex items-center gap-1">
                      <Building className="w-3 h-3 text-slate-400" /> {msg.company}
                    </div>
                  )}

                  {msg.product_interest && (
                    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider mb-2 ${
                      isLiteratureRequest
                        ? 'bg-purple-100 text-purple-800 border border-purple-200'
                        : 'bg-slate-100 text-[#0284c7]'
                    }`}>
                      {isLiteratureRequest ? '📖 ' : ''}
                      <span className="truncate max-w-[260px]">{msg.product_interest}</span>
                    </div>
                  )}

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {msg.message}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Message Details Pane (7 Cols) */}
        <div className="lg:col-span-7">
          {selectedMessage ? (
            <Card className="border-slate-200/90 shadow-sm bg-white rounded-3xl p-6 sm:p-8 space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-2xl font-bold text-slate-900">{selectedMessage.name}</h2>
                    {selectedMessage.status === 'unread' ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        Unread
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Read
                      </span>
                    )}
                  </div>
                  {selectedMessage.company && (
                    <p className="text-sm font-semibold text-slate-600 flex items-center gap-1.5">
                      <Building className="w-4 h-4 text-slate-400" /> {selectedMessage.company}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleToggleStatus(selectedMessage.id, selectedMessage.status)}
                    className="text-xs font-semibold"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    {selectedMessage.status === 'read' ? 'Mark Unread' : 'Mark Read'}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 text-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                  </Button>
                </div>
              </div>

              {/* Contact Pill Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a 
                  href={`mailto:${selectedMessage.email}`}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-sky-50/50 hover:border-sky-200 transition-colors"
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#0284c7] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">Email</span>
                    <span className="block text-xs font-bold text-slate-800 truncate">{selectedMessage.email}</span>
                  </div>
                </a>

                {selectedMessage.phone ? (
                  <a 
                    href={`tel:${selectedMessage.phone}`}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-emerald-50/50 hover:border-emerald-200 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-[10px] font-bold text-slate-400 uppercase">Phone</span>
                      <span className="block text-xs font-bold text-slate-800 truncate">{selectedMessage.phone}</span>
                    </div>
                  </a>
                ) : (
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 opacity-60">
                    <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-500 flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-[10px] font-bold text-slate-400 uppercase">Phone</span>
                      <span className="block text-xs text-slate-500">Not provided</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Equipment Interest */}
              {selectedMessage.product_interest && (
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Equipment Inquired
                  </span>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sky-50 text-[#0284c7] font-bold text-xs border border-sky-100">
                    <MessageSquare className="w-3.5 h-3.5" />
                    {selectedMessage.product_interest}
                  </div>
                </div>
              )}

              {/* Inquiry Message Body */}
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Client Message
                </span>
                <div className="p-5 rounded-2xl bg-slate-50/90 border border-slate-200/80 text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-sans">
                  {selectedMessage.message}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-100">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Received {new Date(selectedMessage.created_at || Date.now()).toLocaleString()}
                </span>
                <a 
                  href={`mailto:${selectedMessage.email}?subject=Re: Inquiry on ${encodeURIComponent(selectedMessage.product_interest || 'Elanpro Commercial Cooling')}`}
                  className="inline-flex items-center gap-1.5 font-bold text-[#0284c7] hover:underline"
                >
                  Reply via Email <Send className="w-3.5 h-3.5" />
                </a>
              </div>

            </Card>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 p-12 border-2 border-dashed border-slate-200 rounded-3xl min-h-[350px]">
              <Mail className="w-12 h-12 mb-3 text-slate-300" />
              <p className="text-base font-semibold text-slate-600">Select an inquiry to view details</p>
              <p className="text-xs text-slate-400 mt-1">Client messages and quote requests will appear here.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
