import { Server } from 'socket.io';
import { setIO } from '@/lib/socket-server';

export default function handler(req, res) {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    setIO(io);

    io.on('connection', (socket) => {
      console.log('✅ Socket connected:', socket.id);

      socket.on('task:create', (task) => {
        socket.broadcast.emit('task:created', task);
      });

      socket.on('task:update', (task) => {
        socket.broadcast.emit('task:updated', task);
      });

      socket.on('task:delete', (taskId) => {
        socket.broadcast.emit('task:deleted', taskId);
      });
    });

    res.socket.server.io = io;
  }

  res.end();
}
