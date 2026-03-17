import React from 'react';
import { MoreHorizontal, Plus } from 'lucide-react';

const RoomMembers = ({ members }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-gray-50/50 dark:bg-black/10">
      <div className="space-y-3">
        {members.map(member => (
          <div key={member.id} className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full ${member.avatar} relative`}>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border border-surface-color" />
              </div>
              <span className="font-medium text-sm">{member.name} {member.isHost && '👑'}</span>
            </div>
            <button className="text-text-muted hover:text-text-color">
              <MoreHorizontal size={16} />
            </button>
          </div>
        ))}
        <button className="w-full mt-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-sm font-medium text-text-muted hover:text-primary-500 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-colors flex items-center justify-center gap-2">
          <Plus size={16} /> Invite Friends
        </button>
      </div>
    </div>
  );
};

export default RoomMembers;
