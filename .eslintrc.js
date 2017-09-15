module.exports = {
  "ecmaVersion": 6,
  "env" : {
    "mocha" : true
  },
  "rules" : {
    "no-unused-vars" : [
      "error",
      {"varsIgnorePattern" : "should|expect" }
    ]
  }
};
