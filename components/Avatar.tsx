// app/components/Avatar.tsx
"use client";

interface AvatarProps {
  color: string;
  fullname: string;
}

export default function Avatar({ color, fullname }: AvatarProps) {
  const initials = fullname
    .split(' ')
    .map(name => name.charAt(0).toUpperCase())
    .join('');

  return (
    <div style={{
      backgroundColor: color,
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#fff',
      fontWeight: 'bold',
    }}>
      {initials}
    </div>
  );
}
