## 4-1

setInterval로 callback함수를 반복시키는 예제이다.

```
var count = 0;
var timer = setInterval(function() {
  console.log(count);
  if (++count > 4) clearInterval(timer);
}, 300);
```
콜백함수는 다른 코드에게 인자로 넘겨질때 제어권이 넘겨진다.

언제 실행되고 어느 형식으로 넣어야 하는지는 내가 사용할 WebAPI에 의해 결정된다.

위의 코드에서 WebAPI인 setInterval는 실행할 함수와 반복되는 시간을 입력받는다.

코드에 callback함수와 300이란 인수를 주었으므로 funciton()이 매 300ms 마다 실행된다. 

내부 코드를 보면 count를 세다가 4보다 커지면 clearInterval로 끊어준다. 



## 4-2

4-1의 예제를 좀더 알기쉽게 다르게 표현한 것이다. 출력은 같다.

```
var count = 0;
var cbFunc = function() {
  console.log(count);
  if (++count > 4) clearInterval(timer);
};
var timer = setInterval(cbFunc, 300);
```

setInterval WebAPI의 callback으로 cbFunc함수를 인자로 넘겼는데 이 함수는 4-1과 같이 1에서 4까지 센후 멈추는 함수이다.

또한 인자로 300ms를 넘겼으므로 0에서 4까지 300ms 간격으로 출력하고 clearInterval로 인해 멈추게 된다.

즉 callbackfunction의 제어권이 사용자가 아니라 setInterval에 있다는 것을 보인것이다. 



## 4-3 

이전 챕터에서 다뤘던 map을 콜백함수에 대한 지식을 바탕으로 다시 본다.

```
var newArr = [10, 20, 30].map(function(currentValue, index) {
    console.log(currentValue, index);
    return currentValue + 5;
});
console.log(newArr);
```

콜백함수는 사용자가 마음대로 짜는게 아니라 넘겨받는 함수가 설정한 형식에 맞추어서 넘겨야한다.

map은 첫번째 인자로 callback함수를 받고 그 함수의 인자로 첫번째 : 현재 value, 두번째 : index, 세번째 : 배열자체가 담긴다.

또한 map은 생략가능한 두번째 인자로 this로 인식할 대상을 넣는다. 

그리고 각 배열요소에 대해서 callback 함수를 반복한다.

앞의 지식을 바탕으로 코드를 보면 배열 요소 개수만큼 반복하는데 반복마다 현재 값과 그 index를 출력하며 현제 value에 5를 더해서 리턴한다.

따라서 배열은 [15, 25, 35]가 된다.



## 4-4

callback함수의 인자를 지정된 대로가 아닌 순서를 바꾸어서 사용시 어떻게 되는지 보기위한 예제이다.

```
var newArr2 = [10, 20, 30].map(function(index, currentValue) {
    console.log(index, currentValue);
    return currentValue + 5;
});
console.log(newArr2);
```

변수 이름을 value, index로 한다고 그게 실제 값과 인덱스가 되는것이 아니라 순서대로 value와 index로 인식한다.

즉 console.log(index, currentValue);은 실제로는 배열의 value, index를 출력하고 currentValue + 5;는 배열의 value에 5를 더하는 것이 아니라

index에 5를 더하고 return하는 것이다. 따라서 결과는 [0, 1, 2] -> [5, 6, 7]





## 4-5

map 메서드를 임의로 구현해서 어떻게 callback 함수가 동작하고 그 함수의 this가 어떻게 정의되는지 알아본다.

```
Array.prototype.map = function(callback, thisArg) {
    var mappedArr = [];
    for (var i = 0; i < this.length; i++) {
      var mappedValue = callback.call(thisArg || window, this[i], i, this);
      mappedArr[i] = mappedValue;
    }
    return mappedArr;
};
```

map은 첫번째로 callback 함수를 받고 두번째로 지정하고 싶은 this를 받는다. 코드 동작을 보자.

먼저 mappedArr라는 새로운 배열을 만들고 그 배열에 크기만큼 동작을 반복하는데 그 동작이란

call 메서드를 이용하여 thisArg가 있으면 그것을 callback의 this로 할당하고 없으면 window로 할당한다. 그리고

그 뒤의 인자들을 callback의 인자로 넘겨서 함수를 실행한 결과를 mappedArr의 value로 넘긴다. 

map완료시 그 mappedArr 배열을 넘긴다. 

이런식으로 map이 동작하고 this를 내가 원하는 것으로 바꿀수 있는것이다.


## 4-6

콜백함수에서의 this가 어떻게 지정되는지 여러 예제를 든것이다. 

```
setTimeout(function() {
    console.log(this);
 }, 300);
```

setTimeout의 경우 내부에서 call메서드를 사용하여 callback의 this를 window를 가리키게 한다.

```
[1, 2, 3, 4, 5].forEach(function(x) {
    console.log(this); 
});
```

forEach는 별도로 this를 지정할 인자를 넘겨주지 않았기 때문에 자동으로 window로 지정되어 window가 5번 출력된다.

```
document.body.innerHTML += '<button id="a">클릭</button>';
document.body.querySelector('#a').addEventListener(
    'click',
    function(e) {
      console.log(this, e);
    }
);
```

addEventListener는 메서드의 this를 callback의 함수의 this로 지정하기 때문에 addEventListener를 호출한 HTML 엘리먼트를 가리킨다.



## 4-7

callback함수로 메서드를 넘기면 this는 어떻게 되는지에 대한 예제이다. 

```
var obj = {
    vals: [1, 2, 3],
    logValues: function(v, i) {
      console.log(this, v, i);
    },
};
obj.logValues(1, 2);
[4, 5, 6].forEach(obj.logValues);
```

obj.logValues(1, 2)의 경우 obj.logValues가 가리키는 function을 전달하고 그것의 this는 forEach가 window로 지정하여

callback함수의 this가 가리키는 것은 window가 된다. 

따라서 메서드도 callback함수로 사용되면 this가 callback함수를 호출한 것이 지정해준것으로 결정된다. 



## 4-8

콜백함수의 this를 내가 원하는 값으로 바꾸는 방법이다. 

```
var obj1 = {
    name: 'obj1',
    func: function() {
      var self = this;
      return function() {
        console.log(self.name);
      };
    },
};
var callback = obj1.func();
setTimeout(callback, 1000);
```

함수에 self라는 변수를 만들어서 function()을 호출한 주체인 obj=this를 저장하여 이를 this로 사용하는 방법이다. 

하지만 이것은 실제 this가 바뀌는 것은 아니고 번거롭다.



## 4-9

이 예제는 그냥 this를 사용하지 않는 것이다. 

```
var obj1 = {
    name: 'obj1',
    func: function() {
      console.log(obj1.name);
    },
};
setTimeout(obj1.func, 1000);
```

하지만 이렇게하면 this를 이용한 기술들을 자유롭게 활용하지 못한다. 

내가 obj1으로 name을 결정해 버렸기 때문에 상황에 따라 바꾸지 못한다.


## 4-10



```
var obj1 = {
    name: 'obj1',
    func: function() {
      var self = this;
      return function() {
        console.log(self.name);
      };
    },
};

var obj2 = {
    name: 'obj2',
    func: obj1.func,
};
var callback2 = obj2.func();
setTimeout(callback2, 1500);
```

obj2.func()실행할 것인데 func는  obj1.func가 가리키는 함수를 의 주소를 가진다. 따라서 obj2.func()를 하면 obj1에 있는 
```
func: function() {
      var self = this;
      return function() {
        console.log(self.name);
      };
    },
```
를 실행할 것인데 이때 의 this는 obj2일 것이고 이것을 self에 저장해 놓았다가 

```
function() {
        console.log(self.name);
      };
```
return 후에 setTimeout으로 실행하여 obj2출력

```
var obj3 = { name: 'obj3' };
var callback3 = obj1.func.call(obj3);
setTimeout(callback3, 2000);
```
obj1.func.call(obj3); 이면 obj1.func의 this를 obj3로 바꾸고 실행한다.

이때 this는 obj3이므로 self에 obj3저장후 함수

```
function() {
        console.log(self.name);
      };
```
return 후에 setTimeout으로 실행하여 obj3출력


이렇게 간접적으로 원하는 함수를 바라보는 callback함수를 만들수있다. 



## 4-11

4-8과 같이 전통적인 방법을 쓰지 않아도 bind를 사용하면 this를 내가 원하는것을 바라보게 하기 쉽다.

```
var obj1 = {
    name: 'obj1',
    func: function() {
      console.log(this.name);
    },
};
setTimeout(obj1.func.bind(obj1), 1000);
```

bind로 미리 func의 this를 obj1으로 해놓고 실행시 obj1.name을 출력한다.

```
var obj2 = { name: 'obj2' };
setTimeout(obj1.func.bind(obj2), 1500);
```

미리 func의 this를 obj2로 해놓고 실행시 obj2.name을 출력한다.



## 4-12 

콜백지옥이란 콜백함수안에 콜백함수가 반복되어 깊이가 매우 깊어져 가독성이 크게 떨어지는 문제를 말한다. 

```
setTimeout(
    function(name) {
      var coffeeList = name;
      console.log(coffeeList);
  
      setTimeout(
        function(name) {
          coffeeList += ', ' + name;
          console.log(coffeeList);
  
          setTimeout(
            function(name) {
              coffeeList += ', ' + name;
              console.log(coffeeList);
  
              setTimeout(
                function(name) {
                  coffeeList += ', ' + name;
                  console.log(coffeeList);
                },
                500,
                '카페라떼'
              );
            },
            500,
            '카페모카'
          );
        },
        500,
        '아메리카노'
      );
    },
    500,
    '에스프레소'
);
```

위의 코드같은 경우에는 setTimeout안에 계속 setTimeout이 있어 가독성이 떨어진다 첫번째 실행되는 setTimeout이 에스프레소임에도 코드 가장 밑에있어

동작을 알아보기 힘들다.



## 4-13

4-12와 같은 콜백지옥을 해결하기위해 기명함수를 쓰는 방법이있다.

```
var coffeeList = '';

var addEspresso = function(name) {
  coffeeList = name;
  console.log(coffeeList);
  setTimeout(addAmericano, 500, '아메리카노');
};
var addAmericano = function(name) {
  coffeeList += ', ' + name;
  console.log(coffeeList);
  setTimeout(addMocha, 500, '카페모카');
};
var addMocha = function(name) {
  coffeeList += ', ' + name;
  console.log(coffeeList);
  setTimeout(addLatte, 500, '카페라떼');
};
var addLatte = function(name) {
  coffeeList += ', ' + name;
  console.log(coffeeList);
};

setTimeout(addEspresso, 500, '에스프레소');
```

콜백함수를 기명함수로서 미리 선언해 놓고 사용하는 방법이다. 그리고 콜백함수안에 콜백함수를 넣는 방법은 콜백에 사용할 기명함수 안에서 setTimeout의 콜백으로

또다른 기명함수를 쓰는 것이다. 이렇게 하면 위에서 아래로 읽어 어느 콜백 실행후 다음 어떤게 실행될지 가독성이 좋아진다. 



## 4-14

4-13처럼 한다면 단순히 callback함수로 사용될것을 일일히 변수에 저장하는것은 상대적으로 4-12에 비해 쉽긴하나 일일히 함수명을 찾아서 따라가야 하므로 

아직 가독성이 좋지는 않다. 

```
new Promise(function(resolve) {
    setTimeout(function() {
      var name = '에스프레소';
      console.log(name);
      resolve(name);
    }, 500);
  })
    .then(function(prevName) {
      return new Promise(function(resolve) {
        setTimeout(function() {
          var name = prevName + ', 아메리카노';
          console.log(name);
          resolve(name);
        }, 500);
      });
    })
    .then(function(prevName) {
      return new Promise(function(resolve) {
        setTimeout(function() {
          var name = prevName + ', 카페모카';
          console.log(name);
          resolve(name);
        }, 500);
      });
    })
    .then(function(prevName) {
      return new Promise(function(resolve) {
        setTimeout(function() {
          var name = prevName + ', 카페라떼';
          console.log(name);
          resolve(name);
        }, 500);
      });
});
```

promise를 활용하여 4-13의 동작을 표현할수 있다. promise는 안에서 resolve 또는 reject함수가 있다면 이중 하나가 실행되어야 then으로 넘어간다.

먼저 제일 위의 setTimeout이 실행되면 에스프레소가 500ms이후 출력되고 resolve해놨다가 동작이 끝났으므로 뒤의 then에의해 다음 setTimeout이 실행되는데 

이때 prevName에 resolve한 커피 이름 name을 넘겨주어 이전에 resolve한 이름에 현재 커피 이름을 더해준다.

이것을 반복하여 동작한다. 즉 앞에걸 실행하고 끝나면 then안에 내용 실행하므로 가독성이 좋다.



## 4-15

4-14의 중복되는 코드를 없애고 더 compact하고 가독성 좋게 만들수 있다. 

```
var addCoffee = function(name) {
    return function(prevName) {
      return new Promise(function(resolve) {
        setTimeout(function() {
          var newName = prevName ? prevName + ', ' + name : name;
          console.log(newName);
          resolve(newName);
        }, 500);
      });
    };
};
```

newName = prevName ? prevName + ', ' + name : name;로 prename이 있으면 기존 prename에 name을 더해서 이름을 만들고

이전 이름이 없으면 현재 이름만드로 새 이름을 만든다. 이것을 500ms마다 반복하는데 

```
addCoffee('에스프레소')()
    .then(addCoffee('아메리카노'))
    .then(addCoffee('카페모카'))
    .then(addCoffee('카페라떼'));
```

들어가는 이름은 이렇게 순서대로 보기쉽게 정리할수있다. 



## 4-16

앞의 동작을 generator를 사용하여 비동기 처리를 할수있다. 

```
var addCoffee = function(prevName, name) {
    setTimeout(function() {
      coffeeMaker.next(prevName ? prevName + ', ' + name : name);
    }, 500);
};
```

이 함수는 앞과 같이 prename에 name을 더해주는데 그것을 setTimeout의 callback함수에서 이루어지게 한것이다. 

```
var coffeeGenerator = function*() {
    var espresso = yield addCoffee('', '에스프레소');
    console.log(espresso);
    var americano = yield addCoffee(espresso, '아메리카노');
    console.log(americano);
    var mocha = yield addCoffee(americano, '카페모카');
    console.log(mocha);
    var latte = yield addCoffee(mocha, '카페라떼');
    console.log(latte);
};
var coffeeMaker = coffeeGenerator();
coffeeMaker.next();
```

generator를 실행하면 iterator가 반환되고 이것은 generator안의 yield가 나오면 멈추었다가 next가 실행되면 이전에 멈추었던 지점부터 코드를 진행한다.

따라서 generator안의 코드는 위에서부터 순차적으로 앞에것이 먼저 실행된 다음에야 실행되서 비동기 작업의 동기적 표현이 가능한 것이다. 

출력은 이전의 코드들과 같다. 




## 4-17

async와 await를 활용해서도 비동기 작업을 수행할수있다. 

```
var addCoffee = function(name) {
    return new Promise(function(resolve) {
      setTimeout(function() {
        resolve(name);
      }, 500);
    });
};
```

먼저 비동기 작업을 수행할 함수에 async를 사용하고 비동기 작업이 수행될 함수 앞에다가 await를 쓴다면 앞의 await함수가 실행되어야 뒤의 함수가 실행된다.

```
var coffeeMaker = async function() {
    var coffeeList = '';
    var _addCoffee = async function(name) {
      coffeeList += (coffeeList ? ',' : '') + (await addCoffee(name));
    };
    await _addCoffee('에스프레소');
    console.log(coffeeList);
    await _addCoffee('아메리카노');
    console.log(coffeeList);
    await _addCoffee('카페모카');
    console.log(coffeeList);
    await _addCoffee('카페라떼');
    console.log(coffeeList);
};
coffeeMaker();
```

위와 같이 사용시 addCoffee동작을 순차적으로 수행하기위한 coffeeMaker함수에 async를 쓰고 순차적으로 실행될 addCoffee에 await를 사용한다면 

4-16의 yield처럼 위에서부터 순서대로 addCoffe가 실행된다. 