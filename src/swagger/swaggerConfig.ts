// import swaggerJSDoc from "swagger-jsdoc";

// const options = {
//   definition: {
//     openapi: "3.0.0",
//     info: {
//       title: "My API",
//       version: "1.0.0",
//     },
//     components: {
//       securitySchemes: {
//         bearerAuth: {
//           type: "http",
//           scheme: "bearer",
//         },
//       },
//     },
//     security: [{ bearerAuth: [] }],
//   },
//   apis: ["./src/app/modules/**/*.swagger.ts"],
// };

// export const swaggerSpec = swaggerJSDoc(options);
// src/swagger/swaggerConfig.ts

import swaggerJSDoc from "swagger-jsdoc";

export const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Your API",
      version: "1.0.0",
      description: "API documentation for your project",
    },
    servers: [
      {
        url: "http://localhost:5000/api/v1",
        description: "Local server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/app/modules/**/*.swagger.yaml", "./src/app/swagger/**/*.swagger.yaml"],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
