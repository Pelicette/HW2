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


