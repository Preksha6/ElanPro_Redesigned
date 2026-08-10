import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Check, Mail, Building, Phone, Calendar } from 'lucide-react';

export default function ManageMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    setLoading(true);
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      toast({ variant: 'destructive', title: 'Error fetching messages', description: error.message });
    } else {
      setMessages(data || []);
    }
    setLoading(false);
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this message?')) return;
    const { error } = await supabase.from('contact_messages').delete().eq('id', id);
    if (error) {
      toast({ variant: 'destructive', title: 'Error deleting', description: error.message });
    } else {
      toast({ title: 'Success', description: 'Message deleted successfully.' });
      setMessages(messages.filter(m => m.id !== id));
      if (selectedMessage?.id === id) setSelectedMessage(null);
    }
  }

  async function handleMarkAsRead(id, currentStatus) {
    if (currentStatus === 'read') return;
    
    const { error } = await supabase
      .from('contact_messages')
      .update({ status: 'read' })
      .eq('id', id);
      
    if (error) {
      toast({ variant: 'destructive', title: 'Error updating status', description: error.message });
    } else {
      toast({ title: 'Success', description: 'Message marked as read.' });
      setMessages(messages.map(m => m.id === id ? { ...m, status: 'read' } : m));
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, status: 'read' });
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Manage Inquiries</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Messages List */}
        <div className="lg:col-span-1 border-r border-zinc-200 dark:border-zinc-800 pr-6 overflow-y-auto max-h-[80vh] custom-scrollbar">
          {loading ? (
            <div className="text-zinc-500">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="text-zinc-500 p-4 border border-dashed border-zinc-300 rounded-lg text-center">No messages found.</div>
          ) : (
            <div className="space-y-3">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  onClick={() => {
                    setSelectedMessage(msg);
                    if (msg.status === 'unread') {
                      handleMarkAsRead(msg.id, msg.status);
                    }
                  }}
                  className={`p-4 rounded-xl cursor-pointer transition-all border ${selectedMessage?.id === msg.id ? 'border-primary bg-primary/5' : 'border-zinc-200 hover:border-primary/30 bg-white'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={`font-semibold ${msg.status === 'unread' ? 'text-zinc-900' : 'text-zinc-600'}`}>
                      {msg.name}
                    </h3>
                    {msg.status === 'unread' && (
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1"></span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 truncate mb-2">{msg.product_interest}</p>
                  <p className="text-sm text-zinc-600 line-clamp-2">{msg.message}</p>
                  <div className="mt-3 text-xs text-zinc-400">
                    {new Date(msg.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Message Details */}
        <div className="lg:col-span-2 pl-2">
          {selectedMessage ? (
            <Card className="border-zinc-200 shadow-sm h-full">
              <CardHeader className="flex flex-row items-start justify-between border-b border-zinc-100 pb-6">
                <div>
                  <CardTitle className="text-2xl mb-2">{selectedMessage.name}</CardTitle>
                  <div className="flex flex-wrap gap-4 text-sm text-zinc-500">
                    {selectedMessage.company && (
                      <div className="flex items-center"><Building className="w-4 h-4 mr-1"/> {selectedMessage.company}</div>
                    )}
                    <div className="flex items-center"><Mail className="w-4 h-4 mr-1"/> <a href={`mailto:${selectedMessage.email}`} className="text-primary hover:underline">{selectedMessage.email}</a></div>
                    {selectedMessage.phone && (
                      <div className="flex items-center"><Phone className="w-4 h-4 mr-1"/> <a href={`tel:${selectedMessage.phone}`} className="text-primary hover:underline">{selectedMessage.phone}</a></div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleDelete(selectedMessage.id)} className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="mb-6 inline-block px-3 py-1 bg-zinc-100 rounded-md text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                  Interest: {selectedMessage.product_interest}
                </div>
                
                <div className="bg-zinc-50 rounded-xl p-6 whitespace-pre-wrap text-zinc-700 leading-relaxed border border-zinc-100">
                  {selectedMessage.message}
                </div>
                
                <div className="mt-8 text-xs text-zinc-400 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Received on {new Date(selectedMessage.created_at).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-zinc-400 p-12 border-2 border-dashed border-zinc-200 rounded-2xl">
              <Mail className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-lg">Select a message to view details</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
