(function() {
    'use strict';

    /////////////////
    // BasePokeBot //
    /////////////////

    function BasePokeBot() {
        this.pokemons = [];
    }

    BasePokeBot.prototype.throwPokeballToCatchAPokemon = function(pokemon) {
        if (Math.random() > 0.5) {
            this.pokemons.push(pokemon);

            return pokemon;
        }

        return null;
    };

    /**
     * Cправочник существующих покемонов
     * @type {Array}
     */
    BasePokeBot.prototype.pokedex = [
        {
            kind: 'Бульбазавр',
            type: ['Grase', 'Poison'],
            maxCombatPower: 160,
            maxHealthPoints: 100,
            abilities: ['quickAttack', 'normalAttack'],
            evolve: 'Ивизавр'
        },
        {
            kind: 'Ивизавр',
            type: ['Grase', 'Poison'],
            maxCombatPower: 260,
            maxHealthPoints: 200,
            abilities: ['normalAttack', 'heavyAttack'],
            evolve: 'Венозавр'
        },
        {
            kind: 'Венозавр',
            type: ['Grase', 'Poison'],
            maxCombatPower: 360,
            maxHealthPoints: 300,
            abilities: ['heavyAttack', 'superAttack']
        },
        {
            kind: 'Чермандер',
            type: ['Ground', 'Fire'],
            maxCombatPower: 160,
            maxHealthPoints: 100,
            abilities: ['quickAttack', 'normalAttack'],
            evolve: 'Чермелион'
        },
        {
            kind: 'Чермелион',
            type: ['Ground', 'Fire'],
            maxCombatPower: 260,
            maxHealthPoints: 200,
            abilities: ['normalAttack', 'heavyAttack'],
            evolve: 'Чаризард'
        },
        {
            kind: 'Чаризард',
            type: ['Ground', 'Fire'],
            maxCombatPower: 360,
            maxHealthPoints: 300,
            abilities: ['heavyAttack', 'superAttack']
        },
        {
            kind: 'Пичу',
            type: ['Air', 'Electric'],
            maxCombatPower: 160,
            maxHealthPoints: 100,
            abilities: ['quickAttack', 'normalAttack'],
            evolve: 'Пикачу'
        },
        {
            kind: 'Пикачу',
            type: ['Air', 'Electric'],
            maxCombatPower: 260,
            maxHealthPoints: 200,
            abilities: ['normalAttack', 'heavyAttack'],
            evolve: 'Райчу'
        },
        {
            kind: 'Райчу',
            type: ['Air', 'Electric'],
            maxCombatPower: 360,
            maxHealthPoints: 300,
            abilities: ['heavyAttack', 'superAttack']
        }
    ];

    BasePokeBot.prototype.find = function (list, conditions) {
        throw 'Must be implemented by child object';
    };

    BasePokeBot.prototype.evolve = function (pokemon) {
        throw 'Must be implemented by child object';
    };

    BasePokeBot.prototype.compare = function () {
        throw 'Must be implemented by child object';
    };


    //////////////
    // PockeBot //
    //////////////

    /**
     * Конструктор PokeBot
     */
    function PokeBot() {
        BasePokeBot.apply(this, arguments);

        this._lastConditions = {};
        this._lastFindResult = [];
    }

    PokeBot.prototype = Object.create(BasePokeBot.prototype);
    PokeBot.prototype.constructor = PokeBot;

    /** 
     * Возвращает случайного покемона
     * @param {number} id Идентификатор покемона
     * @param {String} name Имя покемона
     * @return {Object} Объект с покемоном
     */
    PokeBot.prototype.getRandomPokemon = function (id, name) {
        var idx = Math.floor(Math.random() * this.pokedex.length);
        var dex = this.pokedex[idx];
        return {
            id: id,
            name: name,
            kind: dex.kind,
            combatPower: Math.floor(Math.random()*(0.6*dex.maxCombatPower + 1) + 0.3*dex.maxCombatPower),
            healthPoints: Math.floor(Math.random()*(0.6*dex.maxHealthPoints + 1) + 0.3*dex.maxHealthPoints),
        };
    };

    /**
     * Метод поиска покемонов в списке
     * @param  {Array}  list       Список покемонов (например, список всех доступных или уже пойманных)
     * @param  {Object} conditions Условия поиска
     * @return {Array}             Найденные покемоны
     */
    PokeBot.prototype.find = function (list, conditions) {
        if (!(list instanceof Array && conditions instanceof Object)) {
            return undefined;
        }
        if (this._lastConditions !== conditions) {
            this._lastConditions = conditions;
            this._lastFindResult = [];
            var conditions_keys = getCompareProperties(conditions);

            list.forEach(function(currentValue, index, array){
                var eqCnt = 0;
                conditions_keys.forEach(function(key){
                    if (compareVariables(conditions[key], currentValue[key])) {
                        eqCnt++;
                    }
                });
                if (eqCnt === conditions_keys.length) {
                    this._lastFindResult.push(currentValue);
                }
            }, this);
        }

        return this._lastFindResult;
    };

    /**
     * Метод эволюции покемона в следующее поколение, должен возвращать нового покемона с аналогичными характеристиками, если следующее поколение существует
     * @param  {Object} pokemon Покемон
     * @return {Object}         Новый покемон
     */
    PokeBot.prototype.evolve = function (pokemon) {
        var found = this.find(this.pokedex, {kind: pokemon.kind});
        if (found && found.length == 1 && found[0].evolve) {
            var newPokemon = cloneObject(pokemon);
            newPokemon.kind = found[0].evolve;
            return newPokemon;
        }
        return undefined;
    };

    /**
     * Сравнивает двух или больше покемонов
     * @params {...Object} Покемоны
     * @return {boolean} Одинаковые или нет
     */
    PokeBot.prototype.compare = function () {
        var excludePorperties = ['id', 'name'];

        if (arguments.length < 2) {
            return undefined;
        }
        var checkTypes = Array.prototype.every.call(arguments,function(argument){ 
            return typeof argument == "object"; 
        });
        if (!checkTypes) {
            return undefined;
        }
        var pokemonCmpProps = [];
        Array.prototype.forEach.call(arguments, function(argument){
            var props = getCompareProperties(argument);
            props.forEach(function(property){
                if (pokemonCmpProps.indexOf(property) < 0 && 
                    excludePorperties.indexOf(property) < 0) {
                    pokemonCmpProps.push(property);
                }
            });
        });
        var eqPokemons = 1;
        var pokemons = arguments;
        for (var i = 1; i < arguments.length; i++) {
            if (pokemons[0] === pokemons[i]) {
                //Ссылаются на один и тот же объект
                eqPokemons++;
            } else {
                var eqAllProp = 0;
                pokemonCmpProps.forEach(function(key){
                    if (compareVariables(pokemons[0][key], pokemons[i][key])) {
                        eqAllProp++;
                    }
                });
                if (eqAllProp === pokemonCmpProps.length) {
                    eqPokemons++;
                }
            }
        }

        return eqPokemons === arguments.length;
    };

    /**
     * Сравнивает 2 массива
     * @param  {Array}  array1 Перввый массив
     * @param  {Array}  array2 Второй массив
     * @return {boolean}       Равны или нет
     */
    function compareArrays(array1, array2) {
        if (array1 instanceof Array && array2 instanceof Array) {
            if (array1.length === array2.length) {
                return array1.every(function(item, index){
                    return compareVariables(item, array2[index]);
                });
            }
            return false;
        }
        return undefined;
    }

    /**
     * Сравнивает 2 переменные
     * @param  {[type]} var1 Первая переменная
     * @param  {[type]} var2 Вторая переменная
     * @return {boolean}      Равны или нет
     */
    function compareVariables(var1, var2) {
        if (var1 instanceof Array && var2 instanceof Array) {
            return compareArrays(var1, var2);
        }

        return var1 === var2;
    }

    /**
     * Получает список собственных свойст объекта, которые будут сравниваться
     * @param  {Object} obj Объект
     * @return {Array}      Массив свойств
     */
    function getCompareProperties(obj) {
        var compareProps = [];
        Object.getOwnPropertyNames(obj).forEach(function(key){
            if (typeof obj[key] == "string" ||
                typeof obj[key] == "number" ||
                typeof obj[key] == "boolean" ||
                obj[key] instanceof Array) {
                compareProps.push(key);
            }
        });
        return compareProps;
    }

    /**
     * Создает копию объекта
     * @param  {Object} obj Исходный объект
     * @return {Object}     Копия объекта
     */
    function cloneObject(obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }
        var temp = obj.constructor();
        for (var key in obj) {
            temp[key] = cloneObject(obj[key]);
        }
        return temp;
    }

    module.exports = PokeBot;
})();
