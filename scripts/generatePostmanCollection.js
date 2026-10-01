import fs from "node:fs";
import path from "node:path";
import { swaggerSpec } from "../src/Utils/Swagger/swagger.js";

function convertSwaggerToPostman(spec) {
  const collection = {
    info: {
      name: "Mr. Mahmoud Platform API",
      description: "Complete Postman Collection covering ALL endpoints and key parameters across the Mr. Mahmoud Educational Platform.",
      schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    variable: [
      {
        key: "baseUrl",
        value: "http://localhost:3013",
        type: "string"
      },
      {
        key: "token",
        value: "YOUR_JWT_TOKEN_HERE",
        type: "string"
      }
    ],
    item: []
  };

  const folderMap = new Map();

  function getFolder(tagName) {
    if (!folderMap.has(tagName)) {
      const folder = {
        name: tagName,
        item: []
      };
      folderMap.set(tagName, folder);
      collection.item.push(folder);
    }
    return folderMap.get(tagName);
  }

  for (const [pathUrl, methods] of Object.entries(spec.paths)) {
    for (const [method, operation] of Object.entries(methods)) {
      if (typeof operation !== "object" || !operation) continue;

      const tags = operation.tags || ["General"];
      const tagName = tags[0] || "General";
      const folder = getFolder(tagName);

      // Path conversion: replace {param} with :param for Postman format
      const formattedPath = pathUrl.replace(/\{([^}]+)\}/g, ":$1");
      const pathSegments = formattedPath.split("/").filter(Boolean);

      // Query Params
      const queryParams = [];
      const pathVariables = [];

      if (Array.isArray(operation.parameters)) {
        for (const param of operation.parameters) {
          if (param.in === "query") {
            queryParams.push({
              key: param.name,
              value: param.schema?.default !== undefined ? String(param.schema.default) : (param.example ? String(param.example) : ""),
              description: param.description || ""
            });
          } else if (param.in === "path") {
            pathVariables.push({
              key: param.name,
              value: param.example ? String(param.example) : "123",
              description: param.description || ""
            });
          }
        }
      }

      // Headers
      const headers = [
        {
          key: "Accept",
          value: "application/json"
        }
      ];

      // Check security
      if (operation.security && operation.security.length > 0) {
        headers.push({
          key: "Authorization",
          value: "Bearer {{token}}"
        });
      }

      // Body Handling
      let bodyData = null;
      if (operation.requestBody?.content) {
        const content = operation.requestBody.content;

        if (content["application/json"]) {
          headers.push({
            key: "Content-Type",
            value: "application/json"
          });

          const schema = content["application/json"].schema;
          const sampleBody = generateSampleFromSchema(schema);

          bodyData = {
            mode: "raw",
            raw: JSON.stringify(sampleBody, null, 2),
            options: {
              raw: {
                language: "json"
              }
            }
          };
        } else if (content["multipart/form-data"]) {
          const schema = content["multipart/form-data"].schema;
          const formDataItems = [];

          if (schema && schema.properties) {
            for (const [propKey, propVal] of Object.entries(schema.properties)) {
              if (propVal.format === "binary") {
                formDataItems.push({
                  key: propKey,
                  type: "file",
                  src: []
                });
              } else {
                formDataItems.push({
                  key: propKey,
                  value: propVal.example ? String(propVal.example) : "",
                  type: "text"
                });
              }
            }
          }

          bodyData = {
            mode: "formdata",
            formdata: formDataItems
          };
        }
      }

      const requestItem = {
        name: operation.summary || `${method.toUpperCase()} ${pathUrl}`,
        request: {
          method: method.toUpperCase(),
          header: headers,
          ...(bodyData && { body: bodyData }),
          url: {
            raw: `{{baseUrl}}${formattedPath}${queryParams.length > 0 ? "?" + queryParams.map(q => `${q.key}=${q.value}`).join("&") : ""}`,
            host: ["{{baseUrl}}"],
            path: pathSegments,
            ...(queryParams.length > 0 && { query: queryParams }),
            ...(pathVariables.length > 0 && { variable: pathVariables })
          },
          description: operation.description || ""
        },
        response: []
      };

      folder.item.push(requestItem);
    }
  }

  return collection;
}

function generateSampleFromSchema(schema) {
  if (!schema) return {};

  if (schema.example !== undefined) {
    return schema.example;
  }

  if (schema.type === "object" && schema.properties) {
    const obj = {};
    for (const [key, prop] of Object.entries(schema.properties)) {
      obj[key] = generateSampleFromSchema(prop);
    }
    return obj;
  }

  if (schema.type === "array" && schema.items) {
    return [generateSampleFromSchema(schema.items)];
  }

  if (schema.type === "string") {
    if (schema.format === "date-time") return new Date().toISOString();
    if (schema.format === "date") return "2026-08-24";
    if (schema.enum && schema.enum.length > 0) return schema.enum[0];
    return "string";
  }

  if (schema.type === "integer" || schema.type === "number") {
    return schema.default !== undefined ? schema.default : 1;
  }

  if (schema.type === "boolean") {
    return true;
  }

  return {};
}

const postmanCollection = convertSwaggerToPostman(swaggerSpec);

const rootPath = path.resolve("./postman_collection.json");
const altPath = path.resolve("./Mr_Mahmoud_API.postman_collection.json");

fs.writeFileSync(rootPath, JSON.stringify(postmanCollection, null, 2));
fs.writeFileSync(altPath, JSON.stringify(postmanCollection, null, 2));

console.log(`✅ Successfully generated Postman collection!`);
console.log(`Saved to:\n - ${rootPath}\n - ${altPath}`);
