import type { UserPresence } from '../types';

interface AvatarBarProps {
  users: UserPresence[];
}

export function AvatarBar({ users }: AvatarBarProps) {
  return (
    <div className="wanda-avatars">
      <div>
        <p className="eyebrow">Live presence</p>
        <h2>Team availability</h2>
      </div>

      <div className="avatar-stack">
        {users.map((user) => (
          <div key={user.id} className="avatar-pill" title={user.name}>
            <span className="avatar-circle">{user.avatar}</span>
            <span>{user.name}</span>
            <span className={`loki-indicator ${user.online ? 'online' : 'offline'}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
