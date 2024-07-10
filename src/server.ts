import fastify from 'fastify';

const server = fastify();

server.get('/test', () => {
  return 'Hello World'
});

server.listen({ port: 3333 }).then(() => {
  console.log('Server running...');
});
