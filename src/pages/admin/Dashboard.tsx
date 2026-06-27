import React, { useEffect } from 'react';
import { NeuCard } from '../../components/common';
import { FiActivity, FiMessageSquare } from 'react-icons/fi';
import { useDatabase } from '../../hooks/useDatabase';

export const Dashboard: React.FC = () => {
  const { data: messages, fetchCollection: fetchMessages } = useDatabase('contact');
  const { data: projects, fetchCollection: fetchProjects } = useDatabase('projects');

  useEffect(() => {
    fetchMessages();
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = [
    { label: 'Active Projects', value: projects?.filter((p: any) => p.isVisible).length || 0, icon: <FiActivity className="text-purple-500" /> },
    { label: 'Unread Messages', value: messages?.filter((m: any) => !m.read).length || 0, icon: <FiMessageSquare className="text-red-500" /> },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-neu-text mb-2">Dashboard Overview</h1>
        <p className="text-neu-muted">Welcome back to your portfolio command center.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <NeuCard key={idx} hoverEffect className="flex items-center gap-6">
            <div className="p-4 rounded-full shadow-neu-inset text-3xl">
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-neu-muted uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-3xl font-bold text-neu-text mt-1">{String(stat.value)}</h3>
            </div>
          </NeuCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <NeuCard className="h-96 flex flex-col">
          <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
          <div className="flex-1 shadow-neu-inset rounded-xl p-4 flex items-center justify-center text-neu-muted">
            Activity chart will appear here
          </div>
        </NeuCard>
        
        <NeuCard className="h-96 flex flex-col">
          <h3 className="text-xl font-bold mb-4">Traffic Sources</h3>
          <div className="flex-1 shadow-neu-inset rounded-xl p-4 flex items-center justify-center text-neu-muted">
            Traffic chart will appear here
          </div>
        </NeuCard>
      </div>
    </div>
  );
};
