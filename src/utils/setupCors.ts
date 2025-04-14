import fastifyCors from "@fastify/cors";

const setupCors = async (fastify: import("fastify").FastifyInstance) => {
  await fastify.register(fastifyCors, {
    origin: "*",
    methods: "GET",
  });
};

export default setupCors;
