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

car.run();
console.log(car.moved);
console.log(car.fuel);
console.log(car.power);

car.fuel=1000;
console.log(car.fuel);
car.run();

car.power=100;
console.log(car.power);
car.run();

car.moved=1000;
console.log(car.moved);
car.run();
