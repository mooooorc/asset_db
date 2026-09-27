
const call = "http://localhost:3000/packages/valencia"
const response = await fetch(
  call
);

const packageData = await response.json();

console.log(call, packageData);