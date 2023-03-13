const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };
const obj3 = { a: 5, f: 6 };

const x = Object.assign({}, obj1, obj2, obj3); //es5
console.log(x);

const y = { ...obj1, ...obj2, ...obj3 }; //es6
console.log(y);

//객체의 props를 목록으로 가져와 복사해서 출력하는 역할
//동일한 값은 덮어쓰기
