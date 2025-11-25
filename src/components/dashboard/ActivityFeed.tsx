// Activity Feed Component
// Displays recent system events

import React from 'react';
import { formatDate } from '../../services/formatters';
import type { Event } from '../../types/data';

export interface ActivityFeedProps {
  events: Event[];
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ events }) => {
  if (events.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <p className="text-gray-400 text-center">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="space-y-4">
        {events.map((event) => (
          <div 
            key={event.event_id} 
            className="flex items-start space-x-3 pb-4 border-l-2 border-blue-500 pl-4 last:pb-0"
          >
            <div className="flex-1">
              <p className="text-white text-sm">{event.message}</p>
              <p className="text-gray-400 text-xs mt-1">{formatDate(event.created_at)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;
