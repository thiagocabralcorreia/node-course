const express = require("express");

const app = express();

app.use(express.json()); // middleware

app.get("/", (request, response) => {
  return response.json({ message: "Hello, world!" });
});

// The most HTTP METHODS in REST APIs (Representational State Transfer)

// A GET request is used to retrieve information from a server.
// It is a read-only request and is used to retrieve data without changing it.

// A POST request is used to submit data to a server for further processing.
// It is used to create new resources or update existing ones.

// A PUT request is used to update a current resource with new data.
// It is used to replace an entire resource or update some of its parts.

// A PATCH request is used to update partial resources.
// It is used to update only a specific part of a resource, not the entire resource.

// A DELETE request is used to delete a specific resource.
// It is used to delete a resource from a server and is a permanent operation.

// ...

// PARAMS refer to the values that are passed to an API endpoint.
// There are three types of params:

// - Route params: part of the URL, and are used to identify a specific resource.
// For example, in "/users/:id", the ":id" is a route param that represents the unique identifier of a user.

// - Query params: added to the end of the URL as key-value pairs, separated by an "?" and "&".
// They are used to filter or sort data, or to control pagination.
// For example, in an endpoint like "/users?sort=desc&limit=10", "sort" and "limit" are query params.

// - Body params: sent in the request body, usually in JSON format.
// They are used to send data to the server for creation or update of a resource.
// For example, in a POST request to "/users", the request body may contain the user data such as "name", "email", etc.

// Browser only accepts GET methods
app.get("/courses", (request, response) => {
  const query = request.query;
  // http://localhost:3333/courses?page=1&order=desc
  console.log({ query }); // { query: { page: '1', order: 'desc' } }
  return response.json(["Course 1", "Course 2", "Course 3"]);
});

// So it's nice to use Insomnia or Postman to test all methods
app.post("/courses", (request, response) => {
  const body = request.body;
  console.log(body); // { course: 'JavaScript' }
  return response.json(["Course 1", "Course 2", "Course 3", "Course 4"]);
});

app.put("/courses/:id", (request, response) => {
  const { id } = request.params; // const params = request.params;
  console.log({ id }); // { id: '1' }
  return response.json(["Course 6", "Course 2", "Course 3", "Course 4"]);
});

app.delete("/courses/:id", (request, response) => {
  return response.json(["Course 6", "Course 2", "Course 4"]);
});

// localhost:3333
app.listen(3333);
