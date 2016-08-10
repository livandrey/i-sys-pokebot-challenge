(function() {
    'use strict';

    /////////////////
    // BasePokeBot //
    /////////////////

    class BasePokeBot {
        constructor() {
            this.pokemons = [];
        }

        throwPokeballToCatchAPokemon(pokemon) {
            if (Math.random() > 0.5) {
                this.pokemons.push(pokemon);

                return pokemon;
            }

            return null;
        }

        /**
         * Cправочник существующих покемонов
         * @type {Array}
         */
        get pokedex() {
            return [
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
        }

        find(list, conditions) {
            throw 'Must be implemented by child object';
        }

        evolve(pokemon) {
            throw 'Must be implemented by child object';
        }

        compare() {
            throw 'Must be implemented by child object';
        }
    }


    //////////////
    // PockeBot //
    //////////////

    class PokeBot extends BasePokeBot {
        /**
         * Конструктор PokeBot
         */
        constructor(...args) {
            super(...args);
            
            this._lastList = [];
            this._lastConditions = {};
            this._lastFindResult = [];
        }

        /** 
         * Возвращает случайного покемона
         * @param {number} id Идентификатор покемона
         * @param {String} name Имя покемона
         * @return {Object} Объект с покемоном
         */
        getRandomPokemon(id, name) {
            var idx = Math.floor(Math.random() * this.pokedex.length);
            var dex = this.pokedex[idx];
            return {
                id: id,
                name: name,
                kind: dex.kind,
                combatPower: Math.floor(Math.random()*(0.6*dex.maxCombatPower + 1) + 0.3*dex.maxCombatPower),
                healthPoints: Math.floor(Math.random()*(0.6*dex.maxHealthPoints + 1) + 0.3*dex.maxHealthPoints),
            };
        }

        /**
         * Метод поиска покемонов в списке
         * @param  {Array}  list       Список покемонов (например, список всех доступных или уже пойманных)
         * @param  {Object} conditions Условия поиска
         * @return {Array}             Найденные покемоны
         */
        find(list, conditions) {
            if (!(list instanceof Array && typeof conditions == "object")) {
                return undefined;
            }
            if (this._lastConditions !== conditions && this._lastList !== list) {
                this._lastConditions = conditions;
                this._lastFindResult = [];
                var conditions_keys = Object.getOwnPropertyNames(conditions);

                for (let item of list) {
                    let eqCnt = 0;
                    conditions_keys.forEach(key =>{
                        if (compareVariables(conditions[key], item[key])) {
                            eqCnt++;
                        }
                    });
                    if (eqCnt === conditions_keys.length) {
                        this._lastFindResult.push(item);
                    }
                }
            }

            return this._lastFindResult;
        }

        /**
         * Метод эволюции покемона в следующее поколение, должен возвращать нового покемона с аналогичными характеристиками, если следующее поколение существует
         * @param  {Object} pokemon Покемон
         * @return {Object}         Новый покемон
         */
        evolve(pokemon) {
            var found = this.find(this.pokedex, {kind: pokemon.kind});
            if (found && found.length == 1 && found[0].evolve) {
                var newPokemon = Object.assign({}, pokemon);
                newPokemon.kind = found[0].evolve;
                return newPokemon;
            }
            return undefined;
        }

        /**
         * Сравнивает двух или больше покемонов
         * @params {...Object} Покемоны
         * @return {boolean} Одинаковые или нет
         */
        compare(...pokemons) {
            let excludePorperties = ['id', 'name'];

            if (pokemons.length < 2) {
                return undefined;
            }
            let checkTypes = pokemons.every(pokemon => typeof pokemon == "object");
            if (!checkTypes) {
                return undefined;
            }
            let pokemonCmpProps = new Set();
            for (let pokemon of pokemons) {
                for (let prop of Object.getOwnPropertyNames(pokemon)) {
                    pokemonCmpProps.add(prop);
                }
            }
            for (let prop of excludePorperties) {
                pokemonCmpProps.delete(prop);
            }
            let eqPokemons = 1;
            for (var i = 1; i < pokemons.length; i++) {
                if (pokemons[0] === pokemons[i]) {
                    //Ссылаются на один и тот же объект
                    eqPokemons++;
                } else {
                    var eqAllProp = 0;
                    pokemonCmpProps.forEach(key => {
                        if (compareVariables(pokemons[0][key], pokemons[i][key])) {
                            eqAllProp++;
                        }
                    });
                    if (eqAllProp === pokemonCmpProps.length) {
                        eqPokemons++;
                    }
                }
            }

            return eqPokemons === pokemons.length;
        }
    }

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

    module.exports = PokeBot;
})();
