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



## 5-1

클로저가 무엇인지 알기위해 콜스텍에서 실행 컨택스트가 어떻게 동작하는지 보자 

```
var outer = function() {
  var a = 1;
  var inner = function() {
    console.log(++a);
  };
  inner();
};
outer();
```

콜스텍에서 outer가 들어가고 내부 환경은 a와 inner가 있다. 

inner 실행시 inner의 외부 환경은 outer를 가리키고 내부 환경은 없다 이때 ++a를 해야하는데 내부 환경에는 없으므로 스코프 체인을 따라 outer의 a를

찾아서 1을 더해준후 출력한다. 이후 콜스택에서 inner의 LE가제거, outer의 LE가 제거-> a, inner에 대한 참조가 지워지면 가비지 컬렉터가 a, inner를 수집한다. 




## 5-2

5-1의 call스택 동작과 비슷한 동작의 예제이다. 

```
var outer = function() {
  var a = 1;
  var inner = function() {
    return ++a;
  };
  return inner();
};
var outer2 = outer();
console.log(outer2);
```
var outer2 = outer()수행시 5-1처럼 inner의 내부환경에 a가 없기 때문에 스코프 체인을 따라 outer의 a=1을 찾아 1을 더해준 2를 반환한다.

이후 inner의 LE가 제거된 이후 outer의 LE가 제거된다. 5-1과 5-2모두 outer보다 inner가 콜스택에서 제거되어서 이후 별도로 inner를 호출할수 없다. 



## 5-3

가비지 컬렉터는 어던 값을 참조하는 변수가 하나라도 있다면 그 값은 수집대상에 포함하지 않는다라는 것을 이용하여

outer가 pop된 이후에도 inner함수를 호출시키도록 하는 예제이다. 

또한 클로져가 무었이고 어떻게 발생하는지 설명한다. 

클로저의 정의 : 5-3 예제처럼 어던 함수 A에서 선언한 변수 a를 참조하는 내부함수 B를 외부로 전달할 경우 A의 실행 컨텍스트가 종료된 이후에도 변수 a가 

사라지지 않는 현상이다.

```
var outer = function() {
  var a = 1;
  var inner = function() {
    return ++a;
  };
  return inner;
};
var outer2 = outer();
console.log(outer2());
console.log(outer2());
```

var outer2 = outer();에 의해 outer가 콜스택에 들어가고 outer가 inner의 실행 결과가 아닌 함수 자체를 리턴하여 outer2는 inner함수를 참조한다.

이후 outer의 LE는제거될 것이라 생각한다. console.log(outer2());실행시 리턴된 그 inner함수를 실행한다. inner 내부에 a가 없으므로 스코프 체인을 따라 

outer의 a=1을 가져와 1을 더한다. 출력은 2이고 outer의 a는 2를 가리킨다. 이후 inner의 LE는 제거된다. 다시 console.log(outer2());실행시 inner함수를 

실행하고 inner 내부에 a가 없으므로 스코프 체인을 따라 outer의 a=2에서 1을 더하여 3을 출력하고 inner의 LE는 제거된다. 

여기서 중요한 것은 outer의 a가 계속 살아있다는 것이다. 이것은 가비지 컬렉터의 특성으로 var outer2 = outer();로 인해 전역 LE의 내부환경이 inner를 

가리키고 있으므로 inner에 사용되는 outer의 내부환경에 있는 a가 계속 살아있기 때문에 가능한 것이다. 이런 현상을 클로져라고 한다.

## 5-4-1

외부로의 전달은 return말고도 여러 방식이 있음을 보여주는 예제이다. 

```
(function() {
  var a = 0;
  var intervalId = null;
  var inner = function() {
    if (++a >= 10) {
      clearInterval(intervalId);
    }
    console.log(a);
  };
  intervalId = setInterval(inner, 1000);
})();
```

위의 예제는 window 메서드setInterval에 function의 내부함수인 inner를 넘겼으므로 변수 a가 사라지지 않고 계속 남아있어

1에서 10까지 1초마다 출력한다. ==클로저



## 5-4-2

외부로의 전달은 return말고도 여러 방식이 있음을 보여주는 예제이다. 

```
(function() {
  var count = 0;
  var button = document.createElement('button');
  button.innerText = 'click';
  button.addEventListener('click', function() {
    console.log(++count, 'times clicked');
  });
  document.body.appendChild(button);
})();
```

위 코드는 addEventListener에 callback함수 내부에서 지역변수 참조로 클로저라고 할수있다. 


## 5-5-1

5-5는클로저에 의해 의도적으로 지역변수가 가비지 컬랙터에 의해 수집되지 않고 메모리를 소모하게 하는데 이를 원하는 때에 메모리를 소모하지 않게 하는 방법에 대한 

예제이다. 그 방법은 null이나 undefined를 할당하면 된다. 

```
var outer = (function() {
  var a = 1;
  var inner = function() {
    return ++a;
  };
  return inner;
})();
console.log(outer());
console.log(outer());
outer = null; 
```

위 코드는 5-3의 코드에 outer = null; 을 추가한 것인데 클로저를 모두 활용한 이후 참조형 data outer에 null을 넣어 메모리 소모를 멈춘것이다.

가리키는 것이 없으므로 가비지 컬랙터에 의해 수집될 것이다.



## 5-5-2

내부 함수 inner에 참조형이 아닌 null을 할당하여 함수를 그만 가리키게 한다. 더이상 가리키는 것이 없으므로 가비지 컬랙터에 의해 수집될 것이므로 

메모리 소모가 멈춘다.

```
(function() {
  var a = 0;
  var intervalId = null;
  var inner = function() {
    if (++a >= 10) {
      clearInterval(intervalId);
      inner = null; 
    }
    console.log(a);
  };
  intervalId = setInterval(inner, 1000);
})();
```

## 5-5-3

내부함수 clickHandler가 외부로 전달되는데 count가 10이상일시 clickHandler = null;로 가리키는것을 끊어주어 메모리 소모를 멈춘다.

```
(function() {
  var count = 0;
  var button = document.createElement('button');
  button.innerText = 'click';

  var clickHandler = function() {
    console.log(++count, 'times clicked');
    if (count >= 10) {
      button.removeEventListener('click', clickHandler);
      clickHandler = null;
    }
  };
  button.addEventListener('click', clickHandler);
  document.body.appendChild(button);
})();
```


## 5-6

콜백 함수에서 외부 변수를 참조하여 클로저를 만드는 경우에 대한 예제이다. 

```
var fruits = ['apple', 'banana', 'peach'];
var $ul = document.createElement('ul');

fruits.forEach(function(fruit) {
 
  var $li = document.createElement('li');
  $li.innerText = fruit;
  $li.addEventListener('click', function() {
 
    alert('your choice is ' + fruit);
  });
  $ul.appendChild($li);
});
document.body.appendChild($ul);
```

forEach로 fruit배열을 순회하여 li를 생성한다 : forEach의 콜백함수는 외부 변수를 참조하지 않아 클로저가 없다.

addEventListener로 클릭시 원하는 메시지를 출력하도록한다. : 이때의 콜백함수는 fruit라는 외부 변수를 참조하므로 클로저가 존재한다.

이 클로저로 인해 선택한 것이 어떤 과일인지 계속 출력할수있다. 


## 5-7

그런데 5-6의 경우 addEventListener의 콜백 함수가 너무 자주 반복된다는 문제가 있다 따라서 반복되는 콜백 함수를 따로 빼서 변수에 담는다.

```
var fruits = ['apple', 'banana', 'peach'];
var $ul = document.createElement('ul');

var alertFruit = function(fruit) {
  alert('your choice is ' + fruit);
};
fruits.forEach(function(fruit) {
  var $li = document.createElement('li');
  $li.innerText = fruit;
  $li.addEventListener('click', alertFruit);
  $ul.appendChild($li);
});
document.body.appendChild($ul);
alertFruit(fruits[1]);
```

alertFruit(fruits[1]); 수행시 정상적으로 banana가 나오지만 li클릭시 5-6처럼 무엇을 눌렀다고 메시지가 정상적으로 나오지 않는다.

addEventListener는 콜백함수를 호출할때 첫번째 인자에 이벤트 객체를 넣기 때문이다. 




## 5-8

5-7과 같은 문제를 bind를 사용하여 해결할수있다. 

```
var fruits = ['apple', 'banana', 'peach'];
var $ul = document.createElement('ul');

var alertFruit = function(fruit) {
  alert('your choice is ' + fruit);
};
fruits.forEach(function(fruit) {
  var $li = document.createElement('li');
  $li.innerText = fruit;
  $li.addEventListener('click', alertFruit.bind(null, fruit));
  $ul.appendChild($li);
});
document.body.appendChild($ul);
```

bind로 미리 null, fruit를 넘겨주어 정상적으로 클릭한 대상에 대한 메시지를 출력하게 하였다.

하지만 이렇게되면 함수의 this가 달라지게 된다. 이를 위하여 bind가 아닌 함수를 리턴하는 방식으로 코드를 짜야한다. 



## 5-9 

5-8의 this가 바뀌는 문제를 해결하기 위해 함수를 리턴하도록 alertFruitBuilder를 만들었다.

```
var fruits = ['apple', 'banana', 'peach'];
var $ul = document.createElement('ul');

var alertFruitBuilder = function(fruit) {
  return function() {
    alert('your choice is ' + fruit);
  };
};
fruits.forEach(function(fruit) {
  var $li = document.createElement('li');
  $li.innerText = fruit;
  $li.addEventListener('click', alertFruitBuilder(fruit));
  $ul.appendChild($li);
});
document.body.appendChild($ul);
```

`$li.addEventListener('click', alertFruitBuilder(fruit))`에서 alertFruitBuilder(fruit)의 결과로 이전의 5-8의 alertFruit

함수가 리턴되어 콜백함수로 전달된다. 이벤트 발생시 alertFruitBuilder 의 인자인 fruit를 클로저로써 참조하게되어 정상적으로 메시지가 출력됨과 동시에

this가 유지되게된다.

## 5-10

자바스크립트는 변수에 접근권한을 직접 부여할수 없지만 클로저를 이용하여 접근권한을 제어할수 있다. 예를들어 5-3처럼 inner함수를 반환하여 outer의 변수를

외부에서 접근 가능하게 하였다.

이제부터 아래의 게임 코드를 이용하여 접근권한을 제어해보는 예제들을 진행하겠다. 

```
var car = {
  fuel: Math.ceil(Math.random() * 10 + 10),
  power: Math.ceil(Math.random() * 3 + 2), 
  moved: 0, 
  run: function() {
    var km = Math.ceil(Math.random() * 6);
    var wasteFuel = km / this.power;
    if (this.fuel < wasteFuel) {
      console.log('이동불가');
      return;
    }
    this.fuel -= wasteFuel;
    this.moved += km;
    console.log(km + 'km 이동 (총 ' + this.moved + 'km)');
  },
};
```

위의 코드를 설명하면

랜덤으로 fuel, power를 할당한다. run 메서드 실행시 랜덤한 거리를 이동하고 지정된 power와 이동거리에 따라 소모 연료를 계산하고 

남은 연료가 없으면 이동불가를 출력, 이후 남은 연료와 이동거리를 업데이트한다. 

위 코드로 car 객체를 만든후 c.fuel=1000처럼 외부에서 마음대로 바꿀수 있다. 이것을 막기위해 클로저를 활용하여 권한을 제한할수있다. 


## 5-11

권한을 제한하기위해 객체를 바로 할당하지 않고 함수에서 객체를 생성해서 return하게했다. 

```
var createCar = function() {
  var fuel = Math.ceil(Math.random() * 10 + 10); 
  var power = Math.ceil(Math.random() * 3 + 2);
  var moved = 0; 
  return {
    get moved() {
      return moved;
    },
    run: function() {
      var km = Math.ceil(Math.random() * 6);
      var wasteFuel = km / power;
      if (fuel < wasteFuel) {
        console.log('이동불가');
        return;
      }
      fuel -= wasteFuel;
      moved += km;
      console.log(km + 'km 이동 (총 ' + moved + 'km). 남은 연료: ' + fuel);
    },
  };
};
var car = createCar();
```

함수실행시 get moved()와 run함수를 프로퍼티로 가지는 객체를 return한다. return 되지 않은 fuel power는 객체 내부에 없기때문에 외부에서 접근이 불가능 하다.

따라서 외부에서는 moved를 읽거나 run을 실행하는것 말고는 할수있는게 없다

```
car.run();
console.log(car.moved);
console.log(car.fuel);
console.log(car.power);
```

위 코드 수행시 return된 객체에는 fuel와 power가 없으므로 car.fuel, car.power에 대해 undefined를 출력한다.

```
car.fuel=1000;
console.log(car.fuel);
car.run();

car.power=100;
console.log(car.power);
car.run();

car.moved=1000;
console.log(car.moved);
car.run();
```
때문에 위와같이 fuel, power, moved를 임의로 지정하려해도 불가능하다. 



## 5-12

5-11로 권한을 제한하여도 run메서드 자체를 바꾼다면 아직 어뷰징이 가능하다 때문에 객체를 return하기 전에 변경할수 없도록 조치해야한다.

```
var createCar = function() {
  var fuel = Math.ceil(Math.random() * 10 + 10); 
  var power = Math.ceil(Math.random() * 3 + 2);
  var moved = 0; 
  var publicMembers = {
    get moved() {
      return moved;
    },
    run: function() {
      var km = Math.ceil(Math.random() * 6);
      var wasteFuel = km / power;
      if (fuel < wasteFuel) {
        console.log('이동불가');
        return;
      }
      fuel -= wasteFuel;
      moved += km;
      console.log(km + 'km 이동 (총 ' + moved + 'km). 남은 연료: ' + fuel);
    },
  };
  Object.freeze(publicMembers);
  return publicMembers;
};
var car = createCar();
```

위 코드에서는 var publicMembers안에 moved()와 run을 넣고 Object.freeze(publicMembers)로 객체가 변경되는것을 막았다.



## 5-13 

부분적용함수에 대한 예제이다. 부분적용함수랑 미리 일부의 인자를 넘기고 나중에 나머지의 인자를 넘긴 이후부터 실행 결과를 얻을수있는 함수이다. 

이것을 할수있게 해주는 것에는 bind가 있다. 

```
var add = function() {
  var result = 0;
  for (var i = 0; i < arguments.length; i++) {
    result += arguments[i];
  }
  return result;
};
var addPartial = add.bind(null, 1, 2, 3, 4, 5);
console.log(addPartial(6, 7, 8, 9, 10));
```

인자로 받는 값을 모두 더해서 리턴하는 add함수가있다. var addPartial = add.bind(null, 1, 2, 3, 4, 5)로 this는 null을 가리키게 하고

미리 인자로 1, 2, 3, 4, 5를 넘긴다. 이후addPartial(6, 7, 8, 9, 10)로 나머지 인자를 넘기면 함수가 실행되어 1~10을 더한 55가 출력된다.



## 5-14

bind의 경우 this의 값을 변경하기 때문에 메서드에서 사용하기에는 제한된다. 그것을 해결하기위해 this를 바꾸지않는 함수를 구현한다. 

```
var partial = function() {
  var originalPartialArgs = arguments;
  var func = originalPartialArgs[0];
  if (typeof func !== 'function') {
    throw new Error('첫 번째 인자가 함수가 아닙니다.');
  }
  return function() {
    var partialArgs = Array.prototype.slice.call(originalPartialArgs, 1);
    var restArgs = Array.prototype.slice.call(arguments);
    return func.apply(this, partialArgs.concat(restArgs));
  };
};
```

partial함수는 첫번째 인자로 원본 함수를 받고 이후에는 인자를 받는다. var originalPartialArgs = arguments;로 최초 부분 적용함수로 미리 받는 인자들을 받는다

var func = originalPartialArgs[0]로 원본 함수를 받고 

if (typeof func !== 'function')로 함수인지 아진지 판단하여 에러 메시지를 출력한다. 함수가 맞으면 

어떤 함수를 return하는데 최초 부분 적용함수로 미리 받는 인자들중 함수를 제외한 인자들을 partialArgs에 넣고 이후에 실행시 받은 arguments와 합하여 

원본함수의 인자로 넣어 실행하는 함수이다. 그때 apply의 첫번째 인자로 this를 사용하여 실행 시점의 this를 그대로 사용하게하여 this를 유지한다. 

더 자세히 말하면 처음 partial 실행시 originalPartialArgs, func가 세팅되고 function()을 return 시킨후 그 return된 함수 실행시 클로저를 이용하여

세팅된 originalPartialArgs, func과 현재받은 인수인 arguments를 이용하여 함수를 실행하는 것이다.

```
var add = function() {
  var result = 0;
  for (var i = 0; i < arguments.length; i++) {
    result += arguments[i];
  }
  return result;
};
var addPartial = partial(add, 1, 2, 3, 4, 5);
console.log(addPartial(6, 7, 8, 9, 10));
```

위의 설명과 가팅 미리 1-5 인자를 받는데 나중에 실행할 함수는 add이고 addPartial(6, 7, 8, 9, 10)시 add가 실행되어 1-10까지 더한다.

```
var dog = {
  name: '강아지',
  greet: partial(function(prefix, suffix) {
    return prefix + this.name + suffix;
  }, '왈왈, '),
};
console.log(dog.greet('입니다!')); 
```

partial을 사용하여 prefix인 왈왈을 이미 넣어놨으므로 dog.greet('입니다!')실행시 입니다는 suffix로 들어가서 출력은 왈왈, 강아지입니다!가 된다.




## 5-15

인자들을 원하는 위치에 미리 넣고 나중에 빈자리에 인자를 넣을수있는 함수이다. 

```
Object.defineProperty(window, '_', {
  value: 'EMPTY_SPACE',
  writable: false,
  configurable: false,
  enumerable: false,
});

var partial2 = function() {
  var originalPartialArgs = arguments;
  var func = originalPartialArgs[0];
  if (typeof func !== 'function') {
    throw new Error('첫 번째 인자가 함수가 아닙니다.');
  }
  return function() {
    var partialArgs = Array.prototype.slice.call(originalPartialArgs, 1);
    var restArgs = Array.prototype.slice.call(arguments);
    for (var i = 0; i < partialArgs.length; i++) {
      if (partialArgs[i] === _) {
        partialArgs[i] = restArgs.shift();
      }
    }
    return func.apply(this, partialArgs.concat(restArgs));
  };
};
```

for 문으로 만약 미리 받은 인자들중 _이면 그 자리에 나중에 넘겨받은 argument를 shift를 사용하여 넣게 구현하였다.

```
var add = function() {
  var result = 0;
  for (var i = 0; i < arguments.length; i++) {
    result += arguments[i];
  }
  return result;
};
var addPartial = partial2(add, 1, 2, _, 4, 5, _, _, 8, 9);
console.log(addPartial(3, 6, 7, 10)); 
```

따라서 _부분에 3,6,7,10을 넣어 1~10까지 더해서 출력한다.

```
var dog = {
  name: '강아지',
  greet: partial2(function(prefix, suffix) {
    return prefix + this.name + suffix;
  }, '왈왈, '),
};
console.log(dog.greet(' 배고파요!')); 
```

위 코드는 5-14와 같은 해석으로 미리 prefix에 왈왈 할당 함수 실행시 배고파요 suffix에 할당 출력은 왈왈, 강아지 배고파요!

## 5-16

부분함수 사용예시로 디바운스가 있다. 디바운스는 처음 또는 마지막에 발생한 이벤트에 대해 한번만 처리하는 것이다.

```
var debounce = function(eventName, func, wait) {
  var timeoutId = null;
  return function(event) {
    var self = this;
    console.log(eventName, 'event 발생');
    clearTimeout(timeoutId);
    timeoutId = setTimeout(func.bind(self, event), wait);
  };
};
```

디바운스 함수는 인수로 함수와 마지막으로 발새한 이벤트를 판단하기 위한 시간을 받는다. 처음으로 이벤트 발생시 

timeoutId = setTimeout(func.bind(self, event), wait)으로 인해 wait시간이후에 함수를 실행할것이다. 이때 wait 시간 이전에 이벤트가 발생시

clearTimeout(timeoutId)로 초기화 하고 다시 setTimeout(func.bind(self, event), wait)으로 wait 시간 이후에 함수를 실행하도록한다.

만약 wait시간 이내에 동일한 이벤트게 계속 발생시 마지막 이벤트만이 wait시간 이후에 실행될것이다. 

```
var moveHandler = function(e) {
  console.log('move event 처리');
};
var wheelHandler = function(e) {
  console.log('wheel event 처리');
};
document.body.addEventListener('mousemove', debounce('move', moveHandler, 500));
document.body.addEventListener(
  'mousewheel',
  debounce('wheel', wheelHandler, 700)
);
```



## 5-17

커링 함수에 대한 예제이다. 커링함수는 여래개의 인자를 받는 함수를 한개의 인자만을 받는 함수로 나누어서 순차저긍로 호출될 수 있게 구성한 것을 말한다.

커링은 한 번에 하나의 인자만을 전달하고 마지막 인자를 전달받은 후에 함수가 실행된다. 

```
var curry3 = function(func) {
  return function(a) {
    return function(b) {
      return func(a, b);
    };
  };
};

var getMaxWith10 = curry3(Math.max)(10);
```

var getMaxWith10 = curry3(Math.max)(10)에서 curry3 함수에서 Math.max함수를 넘겨 실행하여 


```
function(a) {
    return function(b) {
      return func(a, b);
    };
};
```

를 리턴받고 (10)에의해 이 함수에서 a에 10을 넣고 

```
function(b) {
      return func(a, b);
    };
```

을 리턴받는다. 

```
console.log(getMaxWith10(8)); 
console.log(getMaxWith10(25)); 
```

따라서 getMaxWith10(8)수행시 위 함수에 클로저로 인해 이미 a=10으로 할당되었고 나머지 변수인 b에 8을 할당하여 func(a, b)=Math.max(10,8)=10을 수행

나머지 코드들도 같은식으로 해석이 가능하다. 

```
var getMinWith10 = curry3(Math.min)(10);
console.log(getMinWith10(8)); 
console.log(getMinWith10(25)); 
```



## 5-18

5-17과 같이 함수르 구성하면 인자개수만큼 함수를 만들어야 하기 때문에 깊이가 깊어지고 가독성이 떨어진다.

```
var curry5 = function(func) {
  return function(a) {
    return function(b) {
      return function(c) {
        return function(d) {
          return function(e) {
            return func(a, b, c, d, e);
          };
        };
      };
    };
  };
};
var getMax = curry5(Math.max);
console.log(getMax(1)(2)(3)(4)(5));
```

위와 같이 가독성이 떨어지는 코드가 된다.

따라서 이를 해결하기위해

```
var curry5=func=>a=>b=>c=>d=>e=>func(a,b,c,d,e);
```

와 같이 화살표 함수를 사용하여 한번에표기할수있다. 