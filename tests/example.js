function sample() {
  const returnObj = {
    message: true,
    anotherProperty: "Hello World",
    callback: (key) => {
      return key + "callback called";
    }
  };
  return returnObj;
}

const result = sample;

console.log(result().message);
console.log(result().anotherProperty);
console.log(result().callback("some"));

[1, 2, 3, 4].forEach((key) => {
  console.log(result().callback(key));
})