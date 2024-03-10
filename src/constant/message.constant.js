module.exports = {
  helloWorld: "Hello World!",
  status: {
    success: "SUCCESS",
    error: "ERROR",
  },
  unauthorized:
    "Sorry, you do not have the necessary permissions to access this resource!",
  password: {
    invalid: "Unsatisfactory password!",
    incorrect: "Incorrect password!",
  },
  image: {
    invalid: "Only support .png, jpg, .jpeg, .heic image!",
  },
  token: {
    invalid: "Invalid JWT token!",
    expired: "Expired JWT token!",
  },
  required: (field) => `${field} is required!`,
  notFound: (field) => `${field} is not found!`,
};
