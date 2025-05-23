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
