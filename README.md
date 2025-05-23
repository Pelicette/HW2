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