let arr = [{ id: 1, category: "App", name: "chicken", amount: 10 }];

// not array, object instead
let newDish = { id: 2, category: "Snack", name: "chips", amount: 1 };

arr = [...arr, { ...newDish, id: arr.length + 1 }];

console.log(arr);

// setGame({...game, player: {...game.player, name: 'Bob'}});
