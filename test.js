(function() {
    'use strict';

    var PokeBot = require('./PokeBot.js');

    var pb = new PokeBot();

    var list = [{id:1},{id:2},{name:'dsafsd'}, {id:1, arr:["as"]}];
    var conditions = {id:1, sdf: function(){}, sadf:{}, arr:["as"]};

    var searchRes = pb.find(list, conditions);

    console.log(searchRes);


    var p = pb.getRandomPokemon(1,'dfsa');
    p.test = [1,3,4];
    console.log(p);
    var p2 = pb.evolve(p);
    console.log(p2);
    if (p2) {
        p2.test.push(33);
    }
    console.log(p);
    console.log(p2);

    console.log("CMP1:" + pb.compare(p,p2));
    console.log("CMP2:" + pb.compare(p,p));
    console.log("CMP3:" + pb.compare(p,p,p));
    console.log("CMP4:" + pb.compare(p,p2,p2));

    var p3 = { id: 33, name: 'sdfsdf', kind: p.kind, combatPower: p.combatPower, healthPoints : p.healthPoints, test: p.test.slice(0)};
    console.log("CMP5:" + pb.compare(p,p3));


})();